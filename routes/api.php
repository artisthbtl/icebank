<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\V1\UserController;
use App\Http\Controllers\API\V1\AccountController;
use App\Http\Controllers\API\V1\CompanyController;
use App\Http\Controllers\API\V1\ServiceController;
use App\Http\Controllers\API\V1\PlanController;
use App\Http\Controllers\API\V1\TransactionController;
use App\Http\Controllers\API\V1\SubscriptionController;
use App\Http\Controllers\API\V1\VerificationController;
use App\Http\Controllers\API\V1\EmailVerificationController;
use App\Http\Controllers\API\AdminAuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
});

// PUBLIC ROUTES
Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('verify-otp', [AuthController::class, 'verifyOtpAndLogin'])->name('verify-otp');
});

Route::prefix('email')->name('verification.')->group(function () {
    Route::get('/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->name('verify')
        ->middleware('signed');

    Route::post('/resend', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:6,1')
        ->name('resend');
});


// PROTECTED ROUTES
Route::middleware('auth:api')->group(function () {
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::post('refresh', [AuthController::class, 'refresh'])->name('refresh');
        Route::get('me', [AuthController::class, 'me'])->name('me');
    });

    Route::prefix('v1')->name('v1.')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('accounts', AccountController::class);
        Route::apiResource('companies', CompanyController::class);
        Route::apiResource('services', ServiceController::class);
        Route::apiResource('plans', PlanController::class);
        Route::apiResource('transactions', TransactionController::class);
        Route::apiResource('subscriptions', SubscriptionController::class);
        Route::apiResource('verifications', VerificationController::class);
    });
});

// ADMIN ROUTES
Route::prefix('admin')->name('admin.')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login'])->name('login');

    Route::middleware('auth:admin')->group(function() {
        // Route::get('verifications', [AdminVerificationController::class, 'index']);
    });
});