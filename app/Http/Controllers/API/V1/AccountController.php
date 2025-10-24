<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Account;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\AddBalanceRequest;
use App\Http\Resources\V1\AccountResource;
use App\Http\Resources\V1\AccountCollection;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;

class AccountController extends Controller
{
    public function index()
    {
        return new AccountCollection(Account::paginate());
    }

    public function show(Account $account)
    {
        return new AccountResource($account);
    }

    public function addBalance(AddBalanceRequest $request)
    {
        $user = Auth::user();
        $account = $user->account;
        $amount = $request->amount;

        $maxBalance = 999999999999.99; 
        if ($account->balance + $amount > $maxBalance) {
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
