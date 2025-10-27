<?php

namespace App\Policies;

use App\Models\Account;
use App\Models\User;

class AccountPolicy
{
    public function view(User $user, Account $account)
    {
        return $user->id === $account->user_id;
    }
}
