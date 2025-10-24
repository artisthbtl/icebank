<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ValidatePin
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->has('pin')) {
            return response()->json(['error' => 'PIN is required for this action.'], 422);
        }

        if (!Hash::check($request->pin, Auth::user()->pin)) {
            return response()->json(['error' => 'Invalid PIN.'], 403);
        }

        return $next($request);
    }
}