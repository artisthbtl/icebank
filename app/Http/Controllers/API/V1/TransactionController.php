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
use Illuminate\Http\Request;
use Exception;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $account = $user->account;

        if (!$account) {
            return response()->json(['message' => 'User does not have an account.'], 404);
        }

        $transactions = Transaction::where('account_id', $account->id)
                                   ->orderBy('created_at', 'desc')
                                   ->paginate();

        return new TransactionCollection($transactions);
    }

    public function show(Transaction $transaction)
    {
        $user = Auth::user();
        if ($transaction->account_id !== $user->account->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

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

    public function transfer(TransferRequest $request)
    {
        $user = Auth::user();
        $sender = $user->account;
        $amount = $request->amount;
        $receiver = Account::where('account_number', $request->receiverAccountNumber)->first();
        $fee = 0.5;

        if ($sender->id === $receiver->id) {
            return response()->json(['error' => 'You cannot transfer money to your own account.'], 400);
        }

        if ($sender->balance < ($amount + $fee)) {
            return response()->json(['error' => 'Insufficient balance.'], 400);
        }

        try {
            DB::transaction(function () use ($sender, $receiver, $amount, $fee) {
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
            });
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred during the transfer.'], 500);
        }

        return response()->json([
            'message' => 'Transfer successful.',
            'newBalance' => $sender->balance
        ], 200);
    }
}
