<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Account;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\AddBalanceRequest;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    public function validateAmount(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01|max:1000000.00',
        ], [
            'amount.max' => 'The amount entered is too large.',
            'amount.min' => 'The amount must be at least 0.01.',
        ]);

        $user = Auth::user();
        $account = $user->account;
        $amount = $request->amount;

        $maxBalance = 99999999999.99;
        if (($account->balance + $amount) > $maxBalance) {
            return response()->json(['error' => 'Balance limit exceeded.'], 422);
        }

        return response()->json(['message' => 'Amount is valid.'], 200);
    }

    public function addBalance(AddBalanceRequest $request)
    {
        $user = Auth::user();
        $amount = $request->amount;
        $maxBalance = 99999999999.99;

        try {
            $newBalance = DB::transaction(function () use ($user, $amount, $maxBalance) {
                $account = $user->account()->lockForUpdate()->first();

                if (($account->balance + $amount) > $maxBalance) {
                    throw new Exception('Balance limit exceeded.'); 
                }

                $account->balance += $amount;
                $account->save();

                Transaction::create([
                    'account_id' => $account->id,
                    'type' => 'add_balance',
                    'amount' => $amount,
                    'description' => 'Added balance to account',
                ]);

                return $account->balance;
            });

        } catch (Exception $e) {
            if ($e->getMessage() === 'Balance limit exceeded.') {
                return response()->json(['error' => 'Balance limit exceeded.'], 400);
            }

            return response()->json(['error' => 'An error occurred while adding balance.'], 500);
        }

        return response()->json([
            'message' => "$amount ices has been added to your account.",
            'newBalance' => $newBalance
        ], 200);
    }
}
