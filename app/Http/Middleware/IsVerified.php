<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsVerified
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::user()->account->is_verified) {
            return redirect()->route('verify.id');
        }

        if (Auth::user()->account->is_verified || request()->routeIs('verify.id')) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
