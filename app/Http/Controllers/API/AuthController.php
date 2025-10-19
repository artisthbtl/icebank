<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Account;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use App\Http\Requests\V1\RegistrationRequest;
use App\Http\Requests\V1\LoginRequest;
use App\Http\Requests\V1\VerifyOtpRequest;
use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Mail\EmailVerificationMail;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct()
    {
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

    public function verifyOtp(VerifyOtpRequest $request)
    {
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

        $user = User::create($userData);

        $verificationLink = URL::temporarySignedRoute(
            'verify-email',
            now()->addMinutes(30),
            [
                'id' => $user->id,
                'hash' => sha1($user->getEmailForVerification())
            ]
        );

        Mail::to($user)->send(new EmailVerificationMail($user, $verificationLink));
        
        return response()->json([
            'message' => 'Registration successful. A verification link has been sent to your email.'
        ], 201);
    }

    public function verify(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 200);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));

            if (!$user->account) {
                $user->account()->create([
                    'account_number' => $this->generateUniqueAccountNumber(),
                    'is_verified' => 'no',
                    'balance' => 0,
                ]);
            }
        }

        return response()->json(['message' => 'Email has been successfully verified.'], 200);
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

    private function generateUniqueAccountNumber(): string
    {
        for ($i = 0; $i < 5; $i++) {
            $timeComponent = substr((string) (microtime(true) * 1000), -9);
            $randomComponent = random_int(100, 999);
            $candidate = $timeComponent . $randomComponent;

            if (!Account::where('account_number', $candidate)->exists()) {
                return $candidate;
            }

            usleep(1000);
        }

        do {
            $accountNumber = random_int(100000000000, 999999999999);
        } while (Account::where('account_number', $accountNumber)->exists());

        return (string) $accountNumber;
    }
}