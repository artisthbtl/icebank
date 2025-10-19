<?php

namespace App\Http\Controllers\API\V1;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\UserResource;
use App\Http\Resources\V1\UserCollection;
use App\Http\Requests\V1\StorePinRequest;
use App\Http\Requests\V1\UpdateEmailRequest;
use App\Http\Requests\V1\UpdatePinRequest;
use App\Http\Requests\V1\UpdatePasswordRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\UpdateEmailMail;
use App\Mail\EmailChangeMail;
use Illuminate\Support\Facades\URL;

class UserController extends Controller
{
    public function index()
    {
        return new UserCollection(User::paginate());
    }

    public function store(Request $request)
    {
        //
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }

    public function update(Request $request, User $user)
    {
        //
    }

    public function destroy(User $user)
    {
        //
    }

    public function storePin(StorePinRequest $request)
    {
        $user = Auth::user();

        if (!is_null($user->pin)) {
            return response()->json(['message' => 'PIN already set.'], 409);
        }

        $user->pin = Hash::make($request->pin);
        $user->save();

        return response()->json(['message' => 'PIN created successfully.']);
    }

    public function updatePin(UpdatePinRequest $request)
    {
        $user = Auth::user();

        if (!Hash::check($request->currentPin, $user->pin)) {
            return response()->json(['message' => 'Current PIN is incorrect.'], 400);
        }

        $user->pin = Hash::make($request->newPin);
        $user->save();

        return response()->json(['message' => 'PIN updated successfully.']);
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = Auth::user();

        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 400);
        }

        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function updateEmail(UpdateEmailRequest $request)
    {
        $user = Auth::user();
        $oldEmail = $user->email;
        $newEmail = $request->newEmail;

        if (!Hash::check($request->pin, $user->pin)) {
            return response()->json(['message' => 'PIN is incorrect.'], 400);
        }

        $verificationLink = URL::temporarySignedRoute(
            'verify-email-update',
            now()->addMinutes(30),
            [
                'user'      => $user->id,
                'newEmail' => $request->newEmail,
            ]
        );

        Mail::to($request->newEmail)->send(new UpdateEmailMail($user, $verificationLink));
        Mail::to($oldEmail)->send(new EmailChangeMail($user, $newEmail));

        return response()->json([
            'message' => 'A verification link has been sent to your new email. Please verify to complete the update.'
        ], 201);
    }

    public function verifyEmailUpdate(Request $request, User $user)
    {
        $newEmail = $request->query('newEmail');
        
        $user->email = $newEmail;
        $user->email_verified_at = now();
        $user->save();

        return response()->json([
            'message' => 'Your email address has been successfully updated.'
        ], 200);
    }
}
