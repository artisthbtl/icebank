<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\RegistrationRequest;
use App\Http\Requests\V1\LoginRequest;
use App\Mail\RegistrationVerificationMail;
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

        Mail::to($user)->send(new RegistrationVerificationMail($user));
        
        return response()->json([
            'message' => 'Registration successful. A verification link has been sent to your email.'
        ], 201);
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
        return $this->respondWithToken(auth('api')->refresh(), auth('api')->user());
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