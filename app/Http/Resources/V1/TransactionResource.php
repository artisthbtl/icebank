<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\PlanResource;
use App\Http\Resources\V1\UserResource;

class TransactionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $baseData = [
            'id' => $this->id,
            'accountId' => $this->account_id,
            'type' => $this->type,
            'amount' => (float) $this->amount,
            'description' => $this->description,
            'createdAt' => $this->created_at,
        ];

        if ($this->type === 'pay_plan' && $this->relationLoaded('plan')) {
            $baseData['plan'] = new PlanResource($this->whenLoaded('plan'));
        
        } elseif ($this->type === 'transfer') {
            
            if ($this->amount < 0 && $this->relationLoaded('receiverAccount')) {
                 $baseData['receiver'] = new UserResource($this->whenLoaded('receiverAccount')->user);
                 $baseData['receiverAccountNumber'] = $this->whenLoaded('receiverAccount')->account_number;
            
                } elseif ($this->amount > 0 && $this->relationLoaded('senderAccount')) {
                 $baseData['sender'] = new UserResource($this->whenLoaded('senderAccount')->user);
                 $baseData['senderAccountNumber'] = $this->whenLoaded('senderAccount')->account_number;
            }

            $baseData['relatedAccountId'] = $this->related_account_id;
        }

        if ($this->type === 'pay_plan' && !$this->relationLoaded('plan')) {
            $baseData['relatedPlanId'] = $this->related_plan_id;
        }

        return $baseData;
    }
}