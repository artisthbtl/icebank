<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HasAccount
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::user()->account) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'User account not found. Please contact support.'], 404);
            }

            return redirect()->route('dashboard')->withErrors(['account' => 'Account not found.']);
        }

        return $next($request);
    }
}