<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function view(User $authUser, User $user)
    {
        return $authUser->id === $user->id || $authUser->is_admin;
    }
}
