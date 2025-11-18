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
            return redirect()->route('pin.create');
        }

        return $next($request);
    }
}
