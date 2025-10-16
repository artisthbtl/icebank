<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminFactory extends Factory
{
    protected static ?string $password;
    
    public function definition(): array
    {
        return [
            'name' => 'admin',
            'email' => 'marcellokusumo2@gmail.com',
            'password' => static::$password ??= Hash::make('password'),
        ];
    }
}
