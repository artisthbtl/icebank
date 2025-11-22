<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\V1\AccountController;
use App\Http\Controllers\API\V1\UserController;
use App\Http\Controllers\API\V1\VerificationController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\SubscribeController;
use App\Http\Controllers\API\TransactionHistoryController;
use App\Http\Controllers\API\V1\TransactionController;
use App\Http\Controllers\API\V1\SubscriptionController;
use App\Http\Controllers\API\IcemanAuthController;
use App\Http\Controllers\API\IcemanManageServicesController;
use App\Http\Controllers\API\IcemanUserController;
use Illuminate\Support\Facades\Route;

Route::get('/auth/verify-email-update/{user}', [UserController::class, 'verifyEmailUpdate'])->middleware('signed')->name('auth.verify-update');

Route::middleware('guest:web', 'guest:icemen')->group(function () {
    Route::get('/', function () {return inertia('LandingPage');})->name('landing');
    Route::get('/register', function () {return inertia('RegisterPage');})->name('register');
    Route::get('/login', function () {return inertia('LoginPage');})->name('login');
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp'])->name('verify-otp');

    Route::get('/reset-password', function (Illuminate\Http\Request $request) {
        return inertia('ResetPasswordPage', [
            'token' => $request->token,
            'email' => $request->email,
        ]);
    })->name('password.reset');
});

Route::middleware('has.account')->group(function () {
    Route::middleware('auth:web')->group(function () {
        Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/create-pin', function () {return inertia('CreatePinPage');})->name('pin.create');
        Route::post('/users/store-pin', [UserController::class, 'storePin'])->name('pin.store');


        Route::middleware('check.pin')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
            Route::get('/profile', [ProfileController::class, 'index'])->name('profile');

            Route::post('/account/validate-amount', [AccountController::class, 'validateAmount'])->middleware('throttle:10,1')->name('account.validate-amount');
            Route::post('/account/add-balance', [AccountController::class, 'addBalance'])->middleware(['throttle:5,1', 'validate.pin'])->name('account.add-balance');

            Route::get('/verification-file/{filename}', [VerificationController::class, 'showFile'])->name('verification.file');

            Route::put('/profile/pin', [UserController::class, 'updatePin'])->name('profile.update-pin');
            Route::put('/profile/password', [UserController::class, 'updatePassword'])->name('profile.update-password');
            Route::put('/profile/email', [UserController::class, 'updateEmail'])->name('profile.update-email');
            Route::post('/profile/photo', [UserController::class, 'updateProfilePhoto'])->name('profile.update-photo');
            Route::delete('/profile/photo', [UserController::class, 'deleteProfilePhoto'])->name('profile.delete-photo');
            Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');

            Route::get('/transactions', [TransactionHistoryController::class, 'index'])->name('transactions.index');

            Route::middleware(['can.verify'])->group(function () {
                Route::get('/verify-id', function () {return inertia('IdVerificationPage');})->name('verify.id');
                Route::post('/users/verifications', [VerificationController::class, 'store'])->name('verification.store');
            });

            Route::middleware('is.verified')->group(function () {
                Route::post('/transfer/validate', [TransactionController::class, 'validateTransfer'])->name('transfer.validate');
                Route::post('/transfer', [TransactionController::class, 'transfer'])->middleware('validate.pin')->name('transfer');
                Route::get('/subscribe', [SubscribeController::class, 'index'])->name('subscribe.index');                
                Route::post('/subscribe/{plan}', [SubscriptionController::class, 'subscribe'])->middleware('validate.pin')->name('subscribe.store');
                Route::put('/subscribe/{subscription}/cancel', [SubscriptionController::class, 'cancel'])->name('subscribe.cancel');
                Route::post('/subscribe/{plan}/reactivate', [SubscriptionController::class, 'reactivate'])->name('subscribe.reactivate');
            });
        });
    });
});



Route::prefix('iceman')->group(function () {
    
    Route::middleware('guest:icemen', 'guest:web')->group(function () {
        Route::get('/', function () {return inertia('Iceman/Iceman');})->name('iceman.landing');
        Route::get('/login', function () {return inertia('Iceman/LoginPage');})->name('iceman.login');

        Route::post('/login', [IcemanAuthController::class, 'login'])->name('iceman.login.submit');
        Route::post('/verify-otp', [IcemanAuthController::class, 'verifyOtp'])->name('iceman.verify-otp');
    });

    Route::middleware('auth:icemen')->group(function () {
        Route::post('/logout', [IcemanAuthController::class, 'logout'])->name('iceman.logout');
        
        Route::get('/dashboard', function () {
            return inertia('Iceman/DashboardPage');
        })->name('iceman.dashboard');

        Route::get('/services', function () {
            return inertia('Iceman/ManageServicesPage');
        })->name('iceman.services');

        Route::get('/users', [IcemanUserController::class, 'index'])->name('iceman.users');
        Route::get('/users/{user}', [IcemanUserController::class, 'show'])->name('iceman.users.show');

        Route::get('/verification-file/{verification}', [IcemanUserController::class, 'showFile'])->name('iceman.verification.file');
        Route::post('/verifications/{verification}/approve', [IcemanUserController::class, 'approveVerification'])
            ->name('iceman.verifications.approve');
        Route::post('/verifications/{verification}/reject', [IcemanUserController::class, 'rejectVerification'])
            ->name('iceman.verifications.reject');

        Route::get('/companies', [IcemanManageServicesController::class, 'index'])->name('iceman.companies.index');
        Route::post('/companies', [IcemanManageServicesController::class, 'storeCompany'])->name('iceman.companies.store');
        Route::post('/companies/{company}', [IcemanManageServicesController::class, 'updateCompany'])->name('iceman.companies.update');

        Route::get('/companies/{company}', [IcemanManageServicesController::class, 'showCompany'])->name('iceman.companies.show');
        Route::post('/companies/{company}/services', [IcemanManageServicesController::class, 'storeService'])->name('iceman.services.store');
        
        Route::get('/services/{service}', [IcemanManageServicesController::class, 'showService'])->name('iceman.services.show');
        Route::post('/services/{service}', [IcemanManageServicesController::class, 'updateService'])->name('iceman.services.update');
        
        Route::post('/services/{service}/plans', [IcemanManageServicesController::class, 'storePlan'])->name('iceman.plans.store');
        Route::post('/plans/{plan}', [IcemanManageServicesController::class, 'updatePlan'])->name('iceman.plans.update');
    });
});