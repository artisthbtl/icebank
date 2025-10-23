<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Verification;
use Illuminate\Auth\Access\Response;

class VerificationPolicy
{
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, Verification $verification)
    {
        return $user->is_admin || $user->id === $verification->user_id;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Verification $verification): bool
    {
        return false;
    }

    public function delete(User $user, Verification $verification): bool
    {
        return false;
    }

    public function restore(User $user, Verification $verification): bool
    {
        return false;
    }

    public function forceDelete(User $user, Verification $verification): bool
    {
        return false;
    }
}
