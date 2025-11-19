<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CanVerifyIdentity
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        if ($user->account && $user->account->is_verified) {
            return redirect()->route('dashboard');
        }

        $hasPendingVerification = $user->verifications()
            ->where('status', 'pending')
            ->exists();

        if ($hasPendingVerification) {
            return redirect()->route('dashboard'); 
        }

        return $next($request);
    }
}