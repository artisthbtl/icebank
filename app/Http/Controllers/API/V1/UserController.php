<?php

namespace App\Http\Controllers\API\V1;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\DeleteUserRequest;
use App\Http\Resources\V1\UserResource;
use App\Http\Resources\V1\UserCollection;
use App\Http\Requests\V1\StorePinRequest;
use App\Http\Requests\V1\UpdateEmailRequest;
use App\Http\Requests\V1\UpdatePinRequest;
use App\Http\Requests\V1\UpdatePasswordRequest;
use App\Http\Requests\V1\UpdateProfilePhotoRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\UpdateEmailMail;
use App\Mail\EmailChangeMail;
use Exception;
use Illuminate\Support\Facades\URL;

class UserController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $this->authorize('view', $user); 
        return new UserResource($user);
    }

    public function destroy(DeleteUserRequest $request)
    {
        $user = Auth::user();
        
        $this->authorize('delete', $user);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Password is incorrect.'], 400);
        }

        try {
            if ($user->profile_photo_path) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }

            $verifications = $user->verifications;
            foreach ($verifications as $verification) {
                if ($verification->ktp_path) {
                    Storage::disk('local')->delete($verification->ktp_path);
                    Storage::disk('local')->delete($verification->selfie_path);
                    break;
                }
            }
            
            $user->delete();

            return response()->json(['message' => 'User deleted successfully.'], 200);

        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to delete user.'], 500);
        }
    }

    public function storePin(StorePinRequest $request)
    {
        $user = Auth::user();
        
        $this->authorize('update', $user);

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
        
        $this->authorize('update', $user);

        if (!Hash::check($request->currentPin, $user->pin)) {
            return response()->json(['message' => 'Current PIN is incorrect.'], 400);
        }

        if (Hash::check($request->newPin, $user->pin)) {
            return response()->json(['message' => 'The new PIN cannot be the same as the old one.'], 400);
        }

        $user->pin = Hash::make($request->newPin);
        $user->save();

        return response()->json(['message' => 'PIN updated successfully.']);
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = Auth::user();
        
        $this->authorize('update', $user);

        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 400);
        }

        if (Hash::check($request->newPassword, $user->password)) {
            return response()->json(['message' => 'The new password cannot be the same as the old one.'], 400);
        }

        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function updateEmail(UpdateEmailRequest $request)
    {
        $user = Auth::user();
        
        $this->authorize('update', $user);
        
        $oldEmail = $user->email;
        $newEmail = $request->newEmail;

        if (!Hash::check($request->pin, $user->pin)) {
            return response()->json(['message' => 'PIN is incorrect.'], 400);
        }

        if($oldEmail === $newEmail) {
            return response()->json(['message' => 'The new email cannot be the same as the old one.'], 400);
        }

        $verificationLink = URL::temporarySignedRoute(
            'email.verify-update',
            now()->addMinutes(30),
            [
                'user'     => $user->id,
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
        $this->authorize('update', $user);
        
        $newEmail = $request->query('newEmail');
        
        $user->email = $newEmail;
        $user->email_verified_at = now();
        $user->save();

        return response()->json([
            'message' => 'Your email address has been successfully updated.'
        ], 200);
    }

    public function updateProfilePhoto(UpdateProfilePhotoRequest $request)
    {
        $user = Auth::user();
        
        $this->authorize('update', $user);
        
        $oldPhotoPath = $user->profile_photo_path;
        $newPhotoPath = $request->file('photo')->store('profile_photos', 'public');

        try {
            if ($oldPhotoPath) {
                Storage::disk('public')->delete($oldPhotoPath);
            }

            $user->update([
                'profile_photo_path' => $newPhotoPath
            ]);

            return response()->json([
                'message' => 'Profile photo updated successfully.',
                'profilePhotoPath' => $newPhotoPath,
                'photoUrl' => Storage::disk('public')->url($newPhotoPath)
            ], 200);

        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update profile photo.'], 500);
        }
    }

    public function deleteProfilePhoto()
    {
        $user = Auth::user();
        
        $this->authorize('update', $user);
        
        $photoPath = $user->profile_photo_path;

        try {
            if ($photoPath) {
                Storage::disk('public')->delete($photoPath);

                $user->update([
                    'profile_photo_path' => null
                ]);

                return response()->json([
                    'message' => 'Profile photo deleted successfully.'
                ], 200);
            }

            return response()->json([
                'message' => 'No profile photo to delete.'
            ], 400);

        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to delete profile photo.'], 500);
        }
    }
}