<?php

use App\Http\Middleware\CheckPin;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('LandingPage');
});

// Route::get('/home', function () {
//     return inertia('HomePage');
// })->middleware(['auth:api', CheckPin::class])->name('home');

// Route::get('/create-pin', function () {
//     return inertia('Auth/CreatePin');
// })->middleware('auth:api')->name('create-pin');