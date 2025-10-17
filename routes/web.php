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