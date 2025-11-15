<?php

use App\Http\Middleware\CheckPin;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Resources\V1\TransactionCollection;

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
    $user = Auth::user();
    $user->load('account');

    $recentTransactions = \App\Models\Transaction::where('account_id', $user->account->id)
        ->latest()
        ->take(5)
        ->get();

    return inertia('DashboardPage', [
        'account' => $user->account,
        'recentTransactions' => new TransactionCollection($recentTransactions)
    ]);
})->middleware(['auth', 'check.pin'])->name('dashboard');

Route::post('/auth/verify-otp',
    [AuthController::class, 'verifyOtp'
])->name('otp.verify');