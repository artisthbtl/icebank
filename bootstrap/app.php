<?php

use App\Http\Middleware\CanVerifyIdentity;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CheckPin;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\HasAccount;
use App\Http\Middleware\IsIceman;
use App\Http\Middleware\IsVerified;
use App\Http\Middleware\ValidatePin;
use Illuminate\Console\Scheduling\Schedule;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'iceman' => IsIceman::class,
            'check.pin' => CheckPin::class,
            'is.verified' => IsVerified::class,
            'validate.pin' => ValidatePin::class,
            'has.account' => HasAccount::class,
            'can.verify' => CanVerifyIdentity::class,
        ]);
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withSchedule(function (Schedule $schedule): void {
        $schedule->command('subscriptions:renew')->daily();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
