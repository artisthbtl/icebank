<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;

class EmailVerificationController extends Controller
{
    public function verify(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 200);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));

            if (!$user->account) {
                $accountNumber = '';
                do {
                    $accountNumber = mt_rand(100000000000, 999999999999);
                } while (Account::where('account_number', $accountNumber)->exists());

                $user->account()->create([
                    'account_number' => $accountNumber,
                    'is_verified' => 'no',
                    'balance' => 0,
                ]);
            }
        }

        return response()->json(['message' => 'Email has been successfully verified. You can now log in.'], 200);
    }

    public function resend(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'If an account with that email exists, a new verification link has been sent.']);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'This email is already verified.'], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'A new verification link has been sent to your email address.']);
    }
}