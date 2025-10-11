<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\V1\UserController;
use App\Http\Controllers\API\V1\AccountController;
use App\Http\Controllers\API\V1\CompanyController;
use App\Http\Controllers\API\V1\ServiceController;
use App\Http\Controllers\API\V1\PlanController;
use App\Http\Controllers\API\V1\TransactionController;
use App\Http\Controllers\API\V1\SubscriptionController;
use App\Http\Controllers\API\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'api', 'prefix' => 'auth'], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
});

Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\API\V1'], function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('accounts', AccountController::class);
    Route::apiResource('companies', CompanyController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('plans', PlanController::class);
    Route::apiResource('transactions', TransactionController::class);
    Route::apiResource('subscriptions', SubscriptionController::class);
});
