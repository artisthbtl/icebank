<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Verification;
use App\Policies\VerificationPolicy;

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
    ];
}
