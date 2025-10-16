<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\RegistrationRequest;
use App\Http\Requests\V1\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use App\Mail\RegistrationVerificationMail;
use App\Mail\LoginOtpMail;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'verifyOtpAndLogin']]);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Invalid Credentials'], 401);
        }

        $otp = random_int(100000, 999999);
        $cacheKey = 'otp_for_user_' . $user->id;

        Cache::put($cacheKey, $otp, now()->addMinutes(5));

        Mail::to($user)->send(new LoginOtpMail($user, (string)$otp));

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

        $cacheKey = 'otp_for_user_' . $request->userId;
        $storedOtp = Cache::get($cacheKey);

        if (!$storedOtp || $storedOtp != $request->otp) {
            return response()->json(['error' => 'Invalid or expired OTP.'], 401);
        }

        Cache::forget($cacheKey);

        $user = User::find($request->userId);
        $token = auth('api')->login($user);

        return $this->respondWithToken($token, $user);
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
            'userId' => $user->id,
            'accessToken' => $token,
            'tokenType' => 'bearer',
            'expiresIn' => auth('api')->factory()->getTTL() * 60
        ]);
    }
}