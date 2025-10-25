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
            'status' => $this->status,
            'endDate' => $this->end_date,
            'createdAt' => $this->created_at,
            'plan' => new PlanResource($this->whenLoaded('plan')),
        ];
    }
}
