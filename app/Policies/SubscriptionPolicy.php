<?php

namespace App\Policies; // Make sure this namespace is correct

use App\Models\Subscription;
use App\Models\User;

class SubscriptionPolicy
{
    public function view(User $user, Subscription $subscription)
    {
        return $user->id === $subscription->user_id;
    }

    public function cancel(User $user, Subscription $subscription)
    {
        return $user->id === $subscription->user_id;
    }
}