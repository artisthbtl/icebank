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
            'ktpImagePath' => $this->ktp_path 
                ? route('verification.file', ['filename' => basename($this->ktp_path)]) 
                : null,
            'selfieImagePath' => $this->selfie_path 
                ? route('verification.file', ['filename' => basename($this->selfie_path)]) 
                : null,
            'status' => $this->status,
            'rejectionReason' => $this->rejection_reason,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}