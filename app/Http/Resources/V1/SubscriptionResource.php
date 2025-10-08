<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'planId' => $this->plan_id,
            'transactionId' => $this->transaction_id,
            'status' => $this->status,
            'startedDate' => $this->created_at,
            'updatedDate' => $this->updated_at,
            'endDate' => $this->end_date,
        ];
    }
}
