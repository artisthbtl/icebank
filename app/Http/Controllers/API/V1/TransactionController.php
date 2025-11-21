<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Transaction;
use App\Models\Account;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\TransferRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Http\Request as HttpRequest;

class TransactionController extends Controller
{
    public function validateTransfer(HttpRequest $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1|max:1000000.00',
            'receiverAccountNumber' => 'required|string|exists:accounts,account_number,deleted_at,NULL',
        ], [
            'amount.max' => 'The amount entered is too large.',
            'amount.min' => 'The amount must be at least 0.01.',
            'receiverAccountNumber.exists' => 'That account number does not exist.',
        ]);

        $user = Auth::user();
        $sender = $user->account;
        $receiver = Account::where('account_number', $request->receiverAccountNumber)->first();

        if (!$receiver) {
            return response()->json(['errors' => ['receiverAccountNumber' => ['Account not found.']]], 404);
        }

        if ($sender->id === $receiver->id) {
            return response()->json(['errors' => ['receiverAccountNumber' => ['You cannot transfer to your own account.']]], 422);
        }

        $fee = 0.5;
        if ($sender->balance < ($request->amount + $fee)) {
            return response()->json(['errors' => ['amount' => ['Insufficient balance for transfer + fee.']]], 422);
        }

        $maxBalance = 99999999999.99;
        if (($receiver->balance + $request->amount) > $maxBalance) {
            return response()->json([
                'errors' => ['amount' => ['Receiver cannot accept this amount due to balance limits.']]
            ], 422);
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
        $maxBalance = 99999999999.99;

        try {
            return DB::transaction(function () use ($user, $request, $amount, $fee, $maxBalance) {
                
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

                if (($receiver->balance + $amount) > $maxBalance) {
                    return response()->json(['error' => 'Transfer failed. Receiver balance limit exceeded.'], 400);
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