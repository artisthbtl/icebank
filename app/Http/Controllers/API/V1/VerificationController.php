<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Verification;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreVerificationRequest;
use App\Http\Requests\V1\UpdateVerificationRequest;
use App\Http\Resources\V1\VerificationResource;
use App\Http\Resources\V1\VerificationCollection;
use Illuminate\Support\Facades\Auth;

class VerificationController extends Controller
{
    public function index()
    {
        return new VerificationCollection(Verification::paginate());
    }

    public function create()
    {
        //
    }

    public function store(StoreVerificationRequest $request)
    {
        $user = Auth::user();

        $existingVerification = Verification::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingVerification) {
            return response()->json(['message' => 'You already have a pending or approved verification request.'], 409);
        }

        $ktpPath = $request->file('ktpImage')->store('verifications', 'public');
        $selfiePath = $request->file('selfieImage')->store('verifications', 'public');

        $verification = Verification::create([
            'user_id' => $user->id,
            'ktp_image_path' => $ktpPath,
            'selfie_image_path' => $selfiePath,
            'status' => 'pending',
        ]);

        return new VerificationResource($verification);
    }

    public function show(Verification $verification)
    {
        return new VerificationResource($verification);
    }

    public function edit(Verification $verification)
    {
        //
    }

    public function update(UpdateVerificationRequest $request, Verification $verification)
    {
        //
    }

    public function destroy(Verification $verification)
    {
        //
    }
}
