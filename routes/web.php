<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\V1\AccountController;
use App\Http\Controllers\API\V1\UserController;
use App\Http\Controllers\API\V1\VerificationController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\V1\TransactionController;
use Illuminate\Support\Facades\Route;

Route::get('/auth/verify-email-update/{user}', [UserController::class, 'verifyEmailUpdate'])->middleware('signed')->name('auth.verify-update');

Route::middleware('guest')->group(function () {
    Route::get('/', function () {return inertia('LandingPage');})->name('landing');
    Route::get('/register', function () {return inertia('RegisterPage');})->name('register');
    Route::get('/login', function () {return inertia('LoginPage');})->name('login');
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp'])->name('verify-otp');

    Route::get('/reset-password', function (Illuminate\Http\Request $request) {
        return inertia('ResetPasswordPage', [
            'token' => $request->token,
            'email' => $request->email,
        ]);
    })->name('password.reset');
});

Route::middleware('has.account')->group(function () {
    Route::middleware('auth')->group(function () {
        Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/create-pin', function () {return inertia('CreatePinPage');})->name('pin.create');
        Route::post('/users/store-pin', [UserController::class, 'storePin'])->name('pin.store');


        Route::middleware('check.pin')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
            Route::get('/profile', [ProfileController::class, 'index'])->name('profile');

            Route::post('/account/validate-amount', [AccountController::class, 'validateAmount'])->middleware('throttle:10,1')->name('account.validate-amount');
            Route::post('/account/add-balance', [AccountController::class, 'addBalance'])->middleware(['throttle:5,1', 'validate.pin'])->name('account.add-balance');

            Route::get('/verification-file/{filename}', [VerificationController::class, 'showFile'])->name('verification.file');

            Route::put('/profile/pin', [UserController::class, 'updatePin'])->name('profile.update-pin');
            Route::put('/profile/password', [UserController::class, 'updatePassword'])->name('profile.update-password');
            Route::put('/profile/email', [UserController::class, 'updateEmail'])->name('profile.update-email');
            Route::post('/profile/photo', [UserController::class, 'updateProfilePhoto'])->name('profile.update-photo');
            Route::delete('/profile/photo', [UserController::class, 'deleteProfilePhoto'])->name('profile.delete-photo');
            Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');

            Route::middleware(['can.verify'])->group(function () {
                Route::get('/verify-id', function () {return inertia('IdVerificationPage');})->name('verify.id');
                Route::post('/users/verifications', [VerificationController::class, 'store'])->name('verification.store');
            });

            Route::middleware('is.verified')->group(function () {
                Route::post('/transfer/validate', [TransactionController::class, 'validateTransfer'])->name('transfer.validate');
                Route::post('/transfer', [TransactionController::class, 'transfer'])->middleware('validate.pin')->name('transfer');
            });
        });
    });
});