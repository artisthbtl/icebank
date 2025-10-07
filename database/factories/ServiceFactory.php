<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Company;
use App\Models\Service;

class ServiceFactory extends Factory
{
    public function definition(): array
    {
        $type = fake()->randomElement(['Entertainment', 'Lifestyle', 'Utility', 'Education']);
        if ($type === 'Entertainment') {
            $name = fake()->randomElement(['Netflix', 'Spotify', 'Hulu', 'Disney+', 'Amazon Prime']);
        } elseif ($type === 'Lifestyle') {
            $name = fake()->randomElement(['Gym Membership', 'Yoga Classes', 'Meditation App', 'Personal Trainer']);
        } elseif ($type === 'Utility') {
            $name = fake()->randomElement(['Electricity', 'Water', 'Internet', 'Mobile Phone']);
        } else { // Education
            $name = fake()->randomElement(['Online Courses', 'Language Learning App', 'E-book Subscription', 'Tutoring Service']);
        }

        return [
            'company_id' => Company::factory(),
            'name' => $name,
            'type' => $type,
            'description' => fake()->sentence(),
        ];
    }
}