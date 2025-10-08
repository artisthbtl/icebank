<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'accountNumber' => $this->account_number,
            'balance' => $this->balance,
            'isVerified' => $this->is_verified,
            'createdAt' => $this->created_at,
        ];
    }
}
