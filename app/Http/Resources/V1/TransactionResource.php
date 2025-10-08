<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        if ($this->type === 'add_balance') {
            return [
                'id' => $this->id,
                'accountId' => $this->account_id,
                'type' => $this->type,
                'amount' => $this->amount,
                'description' => $this->description,
                'createdAt' => $this->created_at,
            ];
        } elseif ($this->type === 'transfer') {
            return [
                'id' => $this->id,
                'accountId' => $this->account_id,
                'type' => $this->type,
                'amount' => $this->amount,
                'relatedAccountId' => $this->related_account_id,
                'description' => $this->description,
                'createdAt' => $this->created_at,
            ];
        } else {
            return [
                'id' => $this->id,
                'accountId' => $this->account_id,
                'type' => $this->type,
                'amount' => $this->amount,
                'relatedPlanId' => $this->related_plan_id,
                'description' => $this->description,
                'createdAt' => $this->created_at,
            ];
        }
    }
}
