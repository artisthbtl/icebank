<?php

namespace App\Http\Controllers\API;

use App\Models\Admin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AuthService;

class AdminAuthController extends Controller
{
    protected $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $admin = Admin::where('email', $credentials['email'])->first();

        if (!$admin || !Hash::check($credentials['password'], $admin->password)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $this->authService->sendAdminOtp($admin);

        return response()->json([
            'message' => 'OTP has been sent to your email.',
            'adminId' => $admin->id,
        ]);
    }

    public function verifyOtpAndLogin(Request $request)
    {
        $request->validate([
            'adminId' => 'required|exists:admins,id',
            'otp' => 'required|string|digits:6',
        ]);

        if (!$this->authService->verifyAdminOtp($request->adminId, $request->otp)) {
            return response()->json(['error' => 'Invalid or expired OTP.'], 401);
        }

        $admin = Admin::find($request->adminId);
        $token = Auth::guard('admin')->login($admin);

        return $this->respondWithToken($token);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('admin')->factory()->getTTL() * 60
        ]);
    }
}