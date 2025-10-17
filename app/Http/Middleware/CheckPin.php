<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckPin
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::user()->pin === null) {
            return response()->json([
                'message' => 'You must create a PIN to access this feature.'
            ], 403);
        }

        return $next($request);
    }
}
