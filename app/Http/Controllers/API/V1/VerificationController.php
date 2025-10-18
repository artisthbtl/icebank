<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Verification;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreVerificationRequest;
use App\Http\Resources\V1\VerificationResource;
use App\Http\Resources\V1\VerificationCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class VerificationController extends Controller
{
    public function index()
    {
        return new VerificationCollection(Verification::paginate());
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

        $ktpPath = $request->file('ktpImage')->store('verifications', 'local');
        $selfiePath = $request->file('selfieImage')->store('verifications', 'local');

        $verification = Verification::create([
            'user_id' => $user->id,
            'ktp_path' => $ktpPath,
            'selfie_path' => $selfiePath,
            'status' => 'pending',
        ]);

        return new VerificationResource($verification);
    }

    public function showFile($filename)
    {
        try {
            $sanitizedFilename = basename($filename);
            $path = 'verifications/' . $sanitizedFilename;

            $verification = Verification::where('ktp_path', $path)
                                        ->orWhere('selfie_path', $path)
                                        ->firstOrFail();

            $this->authorize('view', $verification);

            $storagePath = ($verification->ktp_path === $path) ? $verification->ktp_path : $verification->selfie_path;

            if (!Storage::disk('local')->exists($storagePath)) {
                return response()->json(['message' => 'File not found on disk.'], 404);
            }
            
            return Storage::disk('local')->response($storagePath);

        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Not Found'], 404);
        }
    }

    public function show(Verification $verification)
    {
        return new VerificationResource($verification);
    }

    public function destroy(Verification $verification)
    {
        //
    }
}
