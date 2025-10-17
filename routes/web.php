<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\V1\UserController;
use App\Http\Controllers\API\V1\VerificationController;

Route::get('/', function () {
    return view('home');
});

Route::get('/register', function () {
    return view('auth.register');
});

// Route::get('/create-pin', [UserController::class, 'createPin'])->name('create.pin');

// Route::get('/verify', [VerificationController::class, 'create'])->name('create.verification');