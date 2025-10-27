<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AdminAuthController;
use App\Http\Controllers\API\ForgotPasswordController;
use App\Http\Controllers\API\V1\PlanController;
use App\Http\Controllers\API\V1\UserController;
use App\Http\Controllers\API\V1\AccountController;
use App\Http\Controllers\API\V1\CompanyController;
use App\Http\Controllers\API\V1\ServiceController;
use App\Http\Controllers\API\V1\TransactionController;
use App\Http\Controllers\API\V1\SubscriptionController;
use App\Http\Controllers\API\V1\VerificationController;

Route::middleware('throttle:6,1')->prefix('auth')->name('auth.')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('verify-otp', [AuthController::class, 'verifyOtp']);

    Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
    Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword']);

    Route::middleware('signed')->group(function () {
        Route::get('/verify/{id}/{hash}', [AuthController::class, 'verify']);
        Route::get('/verify-update/{user}', [UserController::class, 'verifyEmailUpdate']);
    });
});

Route::middleware('auth:api')->group(function () {
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::post('refresh', [AuthController::class, 'refresh'])->name('refresh');
        Route::get('me', [AuthController::class, 'me'])->name('me');
    });

    Route::post('v1/users/store-pin', [UserController::class, 'storePin']);
    Route::middleware('check.pin')->prefix('v1')->name('v1.')->group(function () {
        Route::get('user', [UserController::class, 'index']);
        Route::delete('users/delete-user', [UserController::class, 'destroy']);
        Route::put('users/update-pin', [UserController::class, 'updatePin']);
        Route::put('users/update-password', [UserController::class, 'updatePassword']);
        Route::put('users/update-email', [UserController::class, 'updateEmail']);
        Route::post('users/update-photo', [UserController::class, 'updateProfilePhoto']);
        Route::delete('users/delete-photo', [UserController::class, 'deleteProfilePhoto']);
        Route::delete('users/delete-user', [UserController::class, 'destroy']);

        Route::get('transactions', [TransactionController::class, 'index']);
        Route::get('transactions/{transaction}', [TransactionController::class, 'show']);

        Route::get('verifications', [VerificationController::class, 'index']);
        Route::post('verifications', [VerificationController::class, 'store']);
        Route::get('verifications/latest', [VerificationController::class, 'showLatest']);
        Route::get('verifications/{verification}', [VerificationController::class, 'show']);
        Route::get('verifications/file/{filename}', [VerificationController::class, 'showFile']);

        Route::middleware('validate.pin')->group(function () {
            Route::post('add-balance', [AccountController::class, 'addBalance']);
        });

        Route::get('subscriptions', [SubscriptionController::class, 'index']);
        Route::get('subscriptions/{subscription}', [SubscriptionController::class, 'show']);

        Route::middleware('is.verified')->group(function () {
            Route::middleware('validate.pin')->group(function () {
                Route::post('transfer', [TransactionController::class, 'transfer']);
                Route::post('subscribe/{plan}', [SubscriptionController::class, 'subscribe']);
                Route::post('cancel-subscription/{subscription}', [SubscriptionController::class, 'cancel']);
            });
        });
    });
});
