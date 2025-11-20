<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Transaction;
use App\Models\Account;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\TransferRequest;
use App\Http\Resources\V1\TransactionResource;
use App\Http\Resources\V1\TransactionCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Http\Request as HttpRequest;

class TransactionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $account = $user->account;

        if (!$account) {
            return response()->json(['message' => 'User does not have an account.'], 404);
        }

        $transactions = Transaction::where('account_id', $account->id)
                                   ->with(['plan.service.company', 'receiverAccount.user', 'senderAccount.user'])
                                   ->orderBy('created_at', 'desc')
                                   ->paginate();

        return new TransactionCollection($transactions);
    }

    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);
    
        if ($transaction->type === 'pay_plan') {
            $transaction->load('plan.service.company');
        } elseif ($transaction->type === 'transfer') {
            if ($transaction->amount < 0) {
                $transaction->load('receiverAccount.user');
            } else {
                $transaction->load('senderAccount.user');
            }
        }
        return new TransactionResource($transaction);
    }

    public function validateTransfer(HttpRequest $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'receiverAccountNumber' => 'required|string|exists:accounts,account_number',
        ]);

        $user = Auth::user();
        $sender = $user->account;
        $receiver = Account::where('account_number', $request->receiverAccountNumber)->first();

        if ($sender->id === $receiver->id) {
            return response()->json(['errors' => ['receiverAccountNumber' => ['You cannot transfer to your own account.']]], 422);
        }

        $fee = 0.5;
        if ($sender->balance < ($request->amount + $fee)) {
            return response()->json(['errors' => ['amount' => ['Insufficient balance for transfer + fee.']]], 422);
        }

        return response()->json([
            'receiver_name' => $receiver->user->first_name . ' ' . $receiver->user->last_name,
            'account_number' => $receiver->account_number,
            'amount' => (float) $request->amount,
            'fee' => $fee,
            'total' => (float) $request->amount + $fee
        ]);
    }

    public function transfer(TransferRequest $request)
    {
        $user = Auth::user();
        $amount = $request->amount;
        $fee = 0.5;

        try {
            return DB::transaction(function () use ($user, $request, $amount, $fee) {
                
                $sender = $user->account()->lockForUpdate()->first();
                
                $receiver = Account::where('account_number', $request->receiverAccountNumber)
                                    ->lockForUpdate()
                                    ->first();

                if (!$sender || !$receiver) {
                    return response()->json(['error' => 'Account not found.'], 404);
                }

                if ($sender->id === $receiver->id) {
                    return response()->json(['error' => 'You cannot transfer money to your own account.'], 400);
                }

                if ($sender->balance < ($amount + $fee)) {
                    return response()->json(['error' => 'Insufficient balance.'], 400);
                }

                $sender->balance -= ($amount + $fee);
                $receiver->balance += $amount;
                
                $sender->save();
                $receiver->save();
                
                Transaction::create([
                    'account_id' => $sender->id,
                    'type' => 'transfer',
                    'amount' => -($amount + $fee),
                    'description' => "Transferred $amount to " . $receiver->user->first_name,
                    'related_account_id' => $receiver->id,
                ]);

                Transaction::create([
                    'account_id' => $receiver->id,
                    'type' => 'transfer',
                    'amount' => $amount,
                    'description' => "Received $amount from " . $sender->user->first_name,
                    'related_account_id' => $sender->id,
                ]);

                return response()->json([
                    'message' => 'Transfer successful.',
                    'newBalance' => $sender->balance
                ], 200);
            });

        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred during the transfer.'], 500);
        }
    }
}