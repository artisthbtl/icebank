<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckPin
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user && is_null($user->pin)) {
            if (!$request->routeIs('pin.create') && !$request->routeIs('pin.store')) {
                return redirect()->route('pin.create');
            }
        }

        return $next($request);
    }
}
