<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('LandingPage');
});

Route::get('/home', function () {
    return inertia('HomePage');
})->name('home');