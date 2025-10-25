<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Verification;
use Illuminate\Auth\Access\Response;

class VerificationPolicy
{
    public function view(User $user, Verification $verification)
    {
        return $user->id === $verification->user_id;
    }
}
