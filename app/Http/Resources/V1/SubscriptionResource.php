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
            'plan' => $this->whenLoaded('plan', function() {
                return [
                    'id' => $this->plan->id,
                    'name' => $this->plan->name,
                    'price' => $this->plan->price,
                    'duration' => $this->plan->duration,
                    'service' => [
                        'name' => $this->plan->service->name ?? 'Unknown Service',
                        'type' => $this->plan->service->type ?? 'General',
                        'company' => [
                            'name' => $this->plan->service->company->name ?? 'Unknown Company',
                            'logo_path' => $this->plan->service->company->logo_path ?? null,
                        ]
                    ]
                ];
            }),
        ];
    }
}