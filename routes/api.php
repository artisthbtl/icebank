<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ForgotPasswordController;
use App\Http\Controllers\API\V1\UserController;

Route::prefix('auth')->name('auth.')->group(function () {

    Route::middleware('throttle:60,1')->group(function () {
        Route::get('check-verification/{pollToken}', [AuthController::class, 'checkVerificationStatus'])
            ->name('poll-verification');
    });

    Route::middleware('throttle:6,1')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->name('register');
        Route::post('login', [AuthController::class, 'login'])->name('login');    

        Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLink'])->name('forgot-password');
        Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('reset-password');

        Route::middleware('signed')->group(function () {
            Route::get('/verify/{id}/{hash}', [AuthController::class, 'verify'])->name('verify');
        });
    });
});