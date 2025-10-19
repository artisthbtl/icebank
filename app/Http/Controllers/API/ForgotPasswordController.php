<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Jobs\SendPasswordResetJob;
use App\Models\User;
use Carbon\Carbon;


class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;
        $user = User::where('email', $email)->first();

        if ($user){
            SendPasswordResetJob::dispatch($email);
        }

        return response()->json([
            'message' => 'If an account with that email address exists, a password reset link will be sent.'
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|same:passwordConfirmation', 
        ]);

        $tokenData = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        $user = User::where('email', $request->email)->first();

        if (!$tokenData || !$user || !Hash::check($request->token, $tokenData->token) ||
            Carbon::parse($tokenData->created_at)->addMinutes(60)->isPast() ) {
            return response()->json(['message' => 'Invalid request.'], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password reset successful.'], 200);
    }
}
