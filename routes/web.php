<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\V1\AccountController;
use App\Http\Controllers\API\V1\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    
    Route::get('/', function () {
        return inertia('LandingPage');
    })->name('landing');

    Route::get('/register', function () {
        return inertia('RegisterPage');
    })->name('register');

    Route::get('/login', function () {
        return inertia('LoginPage');
    })->name('login');
});

Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp'])
    ->name('otp.verify');

Route::middleware('auth')->group(function () {
    Route::get('/create-pin', function () {
        return inertia('CreatePinPage');
    })->name('pin.create');
    
    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/users/store-pin', [UserController::class, 'storePin']);
    Route::middleware('check.pin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::post('/account/validate-add-balance', [AccountController::class, 'validateAddBalance']);
        Route::post('/account/add-balance', [AccountController::class, 'addBalance']);
    });
});