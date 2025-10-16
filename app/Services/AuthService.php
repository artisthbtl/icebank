<?php

namespace App\Services;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserLoginOtpMail;
use App\Mail\AdminLoginOtpMail;

class AuthService
{
    public function sendOtp(User $user): void
    {
        $otp = random_int(100000, 999999);
        $cacheKey = 'otp_for_user_' . $user->id;

        Cache::put($cacheKey, $otp, now()->addMinutes(5));

        Mail::to($user)->send(new UserLoginOtpMail($user, (string)$otp));
    }

    public function verifyOtp(int $userId, string $otp): bool
    {
        $cacheKey = 'otp_for_user_' . $userId;
        $storedOtp = Cache::get($cacheKey);

        if (!$storedOtp || $storedOtp != $otp) {
            return false;
        }

        Cache::forget($cacheKey);

        return true;
    }

    public function sendAdminOtp(Admin $admin): void
    {
        $otp = random_int(100000, 999999);
        $cacheKey = 'otp_for_admin_' . $admin->id;

        Cache::put($cacheKey, $otp, now()->addMinutes(5));

        Mail::to($admin)->send(new AdminLoginOtpMail($admin, (string)$otp));
    }

    public function verifyAdminOtp(int $adminId, string $otp): bool
    {
        $cacheKey = 'otp_for_admin_' . $adminId;
        $storedOtp = Cache::get($cacheKey);

        if (!$storedOtp || $storedOtp != $otp) {
            return false;
        }

        Cache::forget($cacheKey);

        return true;
    }
}