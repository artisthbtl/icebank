<?php

namespace App\Policies;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SubscriptionPolicy
{
    public function delete(User $user, Subscription $subscription): bool
    {
        return $user->id === $subscription->user_id;
    }
}
