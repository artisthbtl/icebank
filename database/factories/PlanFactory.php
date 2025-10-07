<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Service;
use App\Models\Plan;

class PlanFactory extends Factory
{
    public function definition(): array
    {
        return [
            'service_id' => Service::factory(),            
            'name' => 'Placeholder Plan Name',
            'price' => fake()->randomFloat(2, 9.99, 199.99),
            'duration' => fake()->randomElement([30, 90, 365]),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Plan $plan) {
            $serviceName = $plan->service->name;
            $durationText = $plan->duration . ' Days';

            $plan->name = $durationText . ' ' . $serviceName;
            $plan->save();
        });
    }
}