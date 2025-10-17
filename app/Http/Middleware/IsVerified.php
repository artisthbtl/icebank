<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsVerified
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::user()->is_verified) {
            return response()->json([
                'message' => 'Your account is not verified. Please complete the verification process to access this feature.'
            ], 403);
        }

        return $next($request);
    }
}
