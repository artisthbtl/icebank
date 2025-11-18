<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AccountResource;
use App\Http\Resources\V1\TransactionCollection;
use App\Http\Resources\V1\UserResource;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $user->load('account');

        $recentTransactions = Transaction::where('account_id', $user->account->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('DashboardPage', [
            'user' => (new UserResource($user))->resolve(),
            'account' => (new AccountResource($user->account))->resolve(),
            'recentTransactions' => new TransactionCollection($recentTransactions)
        ]);
    }
}
