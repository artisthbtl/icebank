<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AccountResource;
use App\Http\Resources\V1\TransactionResource;
use App\Http\Resources\V1\UserResource;
use App\Http\Resources\V1\VerificationResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $user->load('account');

        $recentTransactions = $user->account 
            ? $user->account->transactions()->latest()->take(5)->get() 
            : collect([]);

        $latestVerification = $user->verifications()->latest()->first();

        return Inertia::render('DashboardPage', [
            'auth' => [
                'user' => new UserResource($user),
            ],
            'account' => $user->account ? new AccountResource($user->account) : null,
            'recentTransactions' => TransactionResource::collection($recentTransactions),
            'latestVerification' => $latestVerification ? new VerificationResource($latestVerification) : null,
        ]);
    }
}