<?php

use App\Http\Middleware\CheckPin;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('LandingPage');
});

Route::get('/register', function () {
    return inertia('RegisterPage');
})->name('register');

Route::get('/login', function () {
    return inertia('LoginPage');
})->name('login');