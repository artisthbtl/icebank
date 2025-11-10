<?php

use App\Http\Middleware\CheckPin;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

Route::get('/', function () {
    return inertia('LandingPage');
});

Route::get('/register', function () {
    return inertia('RegisterPage');
})->name('register');

Route::get('/login', function () {
    return inertia('LoginPage');
})->name('login');

Route::get('/create-pin', function () {
    return inertia('CreatePinPage');
})->middleware('auth')->name('pin.create');

Route::get('/dashboard', function () {
    return inertia('DashboardPage');
})->middleware('auth')->name('dashboard');

Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp'])->name('otp.verify');