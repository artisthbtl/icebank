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
        $account = $user->account;
        $amount = $request->amount;

        $maxBalance = 99999999999.99;
        if (($account->balance + $amount) > $maxBalance) {
            return response()->json(['error' => 'Balance limit exceeded.'], 400);
        }

        try {
            DB::transaction(function () use ($account, $amount) {                
                $account->balance += $amount;
                $account->save();

                Transaction::create([
                    'account_id' => $account->id,
                    'type' => 'add_balance',
                    'amount' => $amount,
                    'description' => 'Added balance to account',
                ]);
            });
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred while adding balance.'], 500);
        }

        return response()->json([
            'message' => "$amount ices has been added to your account.",
            'newBalance' => $account->balance
        ], 200);
    }
}
