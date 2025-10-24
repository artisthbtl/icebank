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

class TransactionController extends Controller
{
    public function index()
    {
        return new TransactionCollection(Transaction::paginate());
    }

    public function show(Transaction $transaction)
    {
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
