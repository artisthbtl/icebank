<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegistrationRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function login(LoginRequest $request)
    {
        $token = auth('api')->attempt($request->validated());

        if($token){
            return $this->respondWithToken($token, auth('api')->user());
        } else {
            return response()->json(['error' => 'Invalid Credentials'], 401);
        }
    }

    public function register(RegistrationRequest $request)
    {
        $validatedData = $request->validated(); // validate request

        $userData = Arr::mapWithKeys($validatedData, function ($value, $key) {
            return [Str::snake($key) => $value];
        });

        $userData['password'] = Hash::make($userData['password']);

        $user = User::create($userData); // creating user

        if($user){
            $token = auth('api')->login($user);
            return $this->respondWithToken($token, $user);
        } else {
            return response()->json(['error' => 'Registration failed'], 500);
        }
    }

    public function me()
    {
        return response()->json(auth('api')->user());
    }

    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    protected function respondWithToken($token, $user)
    {
        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }
}