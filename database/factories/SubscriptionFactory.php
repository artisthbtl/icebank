<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Subscription;
use App\Models\Transaction;

class SubscriptionFactory extends Factory
{
    public function definition(): array
    {
        $transaction = Transaction::factory()->payment()->create();

        $plan = $transaction->plan;
        $durationInDays = $plan->duration;

        $endDate = $transaction->created_at->addDays($durationInDays);

        if ($endDate->isPast()) {
            $status = 'expired';
        } else {
            $status = fake()->randomElement(['active', 'active', 'active', 'active', 'canceled']);
        }

        return [
            'transaction_id' => $transaction->id,
            'user_id' => $transaction->account->user_id,
            'plan_id' => $plan->id,
            'end_date' => $endDate,
            'status' => $status,
        ];
    }
}