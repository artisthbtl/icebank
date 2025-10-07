<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Account;
use App\Models\Plan;
use App\Models\Transaction;

class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'account_id' => Account::factory(),
            'type' => 'add_balance',
            'amount' => fake()->randomFloat(2, 20, 500),
            'description' => 'Added balance to account',
            'related_account_id' => null,
            'related_plan_id' => null,  
        ];
    }

    public function transfer(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'transfer',
            'related_account_id' => Account::factory(),
            'description' => 'Transferred funds',
        ]);
    }

    public function payment(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'pay_plan',
            'related_plan_id' => Plan::factory(),
        ])->afterCreating(function (Transaction $transaction) {
            $transaction->amount = $transaction->plan->price;
            $transaction->description = 'Payment for ' . $transaction->plan->name;
            $transaction->save();
        });
    }
}