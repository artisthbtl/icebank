<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Account;

class AccountFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'account_number' => fake()->unique()->numerify('############'),
            'is_verified' => fake()->randomElement(['yes', 'no']),
            'balance' => fake()->randomFloat(2, 0, 20000),
            'status' => 'active',
        ];
    }
}
