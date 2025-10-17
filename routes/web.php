<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\V1\UserController;

Route::get('/', function () {
    return view('home');
});

Route::get('/register', function () {
    return view('auth.register');
});

Route::get('/create-pin', [UserController::class, 'createPin'])->name('pin.create');