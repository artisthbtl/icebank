<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\ServiceProvider;
use App\Models\Verification;
use App\Policies\UserPolicy;
use App\Policies\VerificationPolicy;
use App\Models\Subscription;
use App\Policies\SubscriptionPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }

    protected $policies = [
        Verification::class => VerificationPolicy::class,
        User::class => UserPolicy::class,
        Subscription::class => SubscriptionPolicy::class,
    ];
}
