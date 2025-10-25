<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\ServiceProvider;
use App\Models\Verification;
use App\Policies\UserPolicy;
use App\Policies\VerificationPolicy;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Policies\SubscriptionPolicy;
use App\Policies\TransactionPolicy;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        //
    }

    protected $policies = [
        Verification::class => VerificationPolicy::class,
        User::class => UserPolicy::class,
        Subscription::class => SubscriptionPolicy::class,
        Transaction::class => TransactionPolicy::class,
    ];
}
