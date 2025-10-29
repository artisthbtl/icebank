<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'dateOfBirth' => $this->date_of_birth,
            'city' => $this->city,
            'email' => $this->email,
            'profilePhotoPath' => $this->photo_url,
            'emailVerifiedAt' => $this->email_verified_at,
        ];
    }
}
