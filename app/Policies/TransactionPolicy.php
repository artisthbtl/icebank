<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    public function view(User $user, Transaction $transaction)
    {
        return $user->account->id === $transaction->account_id;
    }
}