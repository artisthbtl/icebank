<?php

namespace App\Http\Controllers\API;

use App\Models\Iceman;
use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Requests\V1\LoginRequest;
use App\Http\Requests\V1\VerifyOtpRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class IcemanAuthController extends Controller
{
    protected AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        
        $iceman = Iceman::where('email', $credentials['email'])->first();

        if (!$iceman || !Hash::check($credentials['password'], $iceman->password)) {
            return response()->json(['error' => 'Invalid Credentials'], 401);
        }

        $this->authService->sendIcemanOtp($iceman);

        return response()->json([
            'message' => 'OTP has been sent to your email.',
            'icemanId' => $iceman->id,
        ]);
    }

    public function verifyOtp(VerifyOtpRequest $request)
    {
        if (!$this->authService->verifyIcemanOtp($request->icemanId, $request->otp)) {
            return response()->json(['error' => 'Invalid or expired OTP.'], 401);
        }

        $iceman = Iceman::find($request->icemanId);

        if (!$iceman) {
            return response()->json(['error' => 'Iceman user not found.'], 404);
        }

        Auth::guard('icemen')->login($iceman, true); // true = remember me

        $request->session()->regenerate();

        return response()->json(['message' => 'Login successful.']);
    }

    public function logout(Request $request)
    {
        Auth::guard('icemen')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('iceman.login');
    }
}