<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\RegistrationRequest;
use App\Http\Requests\V1\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use App\Mail\RegistrationVerificationMail;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'verifyOtpAndLogin']]);
        $this->authService = new AuthService();
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Invalid Credentials'], 401);
        }

        $this->authService->sendOtp($user);

        return response()->json([
            'message' => 'OTP has been sent to your email.',
            'userId' => $user->id,
        ]);
    }

    public function verifyOtpAndLogin(Request $request)
    {
        $request->validate([
            'userId' => 'required|exists:users,id',
            'otp' => 'required|string|digits:6',
        ]);

        if (!$this->authService->verifyOtp($request->userId, $request->otp)) {
            return response()->json(['error' => 'Invalid or expired OTP.'], 401);
        }

        $user = User::find($request->userId);
        $token = auth('api')->login($user);

        return $this->respondWithToken($token, $user);
    }

    public function register(RegistrationRequest $request)
    {
        $validatedData = $request->validated();

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
            'userId' => $user->id,
            'accessToken' => $token,
            'tokenType' => 'bearer',
            'expiresIn' => auth('api')->factory()->getTTL() * 60
        ]);
    }
}