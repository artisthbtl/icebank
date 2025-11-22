<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\Verification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class IcemanUserController extends Controller
{
    public function index()
    {
        $users = User::with('verifications')->get();

        $sortedUsers = $users->sortByDesc(function ($user) {
            $latestVerification = $user->verifications->sortByDesc('created_at')->first();
            return $latestVerification && $latestVerification->status === 'pending';
        })->values();

        $sortedUsers->transform(function ($user) {
            $latest = $user->verifications->sortByDesc('created_at')->first();
            $user->latest_verification_status = $latest ? $latest->status : null;
            return $user;
        });

        return inertia('Iceman/ManageUsersPage', [
            'users' => $sortedUsers
        ]);
    }

    public function show(User $user)
    {
        $user->load(['account', 'verifications']);

        $latestVerification = $user->verifications()->latest()->first();

        $activeSubscriptions = Subscription::with(['plan.service.company'])
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->latest()
            ->take(5)
            ->get();

        $transactions = Transaction::where('account_id', $user->account?->id)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Iceman/ManageUserDetailPage', [
            'user' => $user,
            'latestVerification' => $latestVerification,
            'activeSubscriptions' => $activeSubscriptions,
            'transactions' => $transactions
        ]);
    }

    public function showFile(Verification $verification, Request $request)
    {
        $type = $request->query('type');
        
        $path = match($type) {
            'ktp' => $verification->ktp_path,
            'selfie' => $verification->selfie_path,
            default => null,
        };

        if (!$path || !Storage::disk('local')->exists($path)) {
            abort(404);
        }

        return Storage::disk('local')->response($path);
    }

    public function approveVerification(Verification $verification)
    {
        DB::transaction(function () use ($verification) {
            $verification->update([
                'status' => 'approved',
                'rejection_reason' => null,
            ]);

            $verification->user->account()->update([
                'is_verified' => 'yes'
            ]);
        });

        return redirect()->back()->with('success', 'User verification approved successfully.');
    }

    public function rejectVerification(Request $request, Verification $verification)
    {
        $validated = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ]);

        $verification->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);
        
        $verification->user->account()->update([
            'is_verified' => 'no'
        ]);

        return redirect()->back()->with('success', 'User verification rejected.');
    }
}