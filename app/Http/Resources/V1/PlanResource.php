<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'serviceId' => $this->service_id,
            'name' => $this->name,
            'price' => $this->price,
            'duration' => $this->duration,
            'deletedAt' => $this->deleted_at,
        ];
    }
}
