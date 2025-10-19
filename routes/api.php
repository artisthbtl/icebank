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

Route::get('/user', function (Request $request) {
    return $request->user();
});

// PUBLIC ROUTES
Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('verify-otp', [AuthController::class, 'verifyOtp']);

    Route::middleware('throttle:5,1')->group(function () {
        Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
        Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword']);
    });
});

Route::prefix('email')->name('email')->group(function () {
    Route::middleware('throttle:6,1')->group(function () {
        // Route::post('/resend', [EmailVerificationController::class, 'resend'])->name('resend');
    });

    Route::middleware('signed')->group(function () {
        Route::get('/verify/{id}/{hash}', [AuthController::class, 'verify'])->name('verify-email');
        Route::get('/verify-update/{user}', [UserController::class, 'verifyEmailUpdate'])->name('verify-email-update');
    });
});


// PROTECTED ROUTES
Route::middleware('auth:api')->group(function () {
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::post('refresh', [AuthController::class, 'refresh'])->name('refresh');
        Route::get('me', [AuthController::class, 'me'])->name('me');
    });

    Route::middleware('check.pin')->prefix('v1')->name('v1.')->group(function () {
        Route::apiResource('users', UserController::class)->except(['store', 'update']);
        Route::post('users/store-pin', [UserController::class, 'storePin']);
        Route::put('users/update-pin', [UserController::class, 'updatePin']);
        Route::put('users/update-password', [UserController::class, 'updatePassword']);
        Route::put('users/update-email', [UserController::class, 'updateEmail']);
        Route::apiResource('accounts', AccountController::class);
        Route::apiResource('companies', CompanyController::class);
        Route::apiResource('services', ServiceController::class);
        Route::apiResource('plans', PlanController::class);
        Route::apiResource('verifications', VerificationController::class);
        Route::get('/verifications/files/{filename}', [VerificationController::class, 'showFile']);

        Route::middleware('is.verified')->group(function () {
            Route::apiResource('transactions', TransactionController::class);
            Route::apiResource('subscriptions', SubscriptionController::class);
        });
    });
});

// ADMIN ROUTES
Route::prefix('admin')->name('admin.')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::post('verify-otp', [AdminAuthController::class, 'verifyOtp']);
    
    Route::middleware('auth:admin')->group(function() {
        // Route::get('verifications', [AdminVerificationController::class, 'index']);
    });
});
