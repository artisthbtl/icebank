<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VerificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'ktpImagePath' => $this->ktp_image_path ? url($this->ktp_image_path) : null,
            'selfieImagePath' => $this->selfie_image_path ? url($this->selfie_image_path) : null,
            'status' => $this->status,
            'rejectionReason' => $this->rejection_reason,
        ];
    }
}
