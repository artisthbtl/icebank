<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\LoginOtpMail;

class AuthService
{
    public function sendOtp(User $user): void
    {
        $otp = random_int(100000, 999999);
        $cacheKey = 'otp_for_user_' . $user->id;

        Cache::put($cacheKey, $otp, now()->addMinutes(5));

        Mail::to($user)->send(new LoginOtpMail($user, (string)$otp));
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
}