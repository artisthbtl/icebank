<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $latestVerification = $this->verifications()->latest()->first();

        return [
            'id' => $this->id,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'dateOfBirth' => $this->date_of_birth,
            'city' => $this->city,
            'email' => $this->email,
            'profilePhotoPath' => $this->photo_url,
            'emailVerifiedAt' => $this->email_verified_at,
            'createdAt' => $this->created_at,
            'isVerified' => $this->account->is_verified ?? 'no',
            'latestVerificationStatus' => $latestVerification ? $latestVerification->status : null,
        ];
    }
}