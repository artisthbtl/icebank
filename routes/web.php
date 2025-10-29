<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('LandingPage');
});

// Route::get('/register', function () {
//     return inertia('auth.register');
// });