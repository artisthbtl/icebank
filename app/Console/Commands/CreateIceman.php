<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Iceman;
use Illuminate\Support\Facades\Validator;

class CreateIceman extends Command
{
    protected $signature = 'iceman:create';

    protected $description = 'Create a new Iceman (admin) user';

    public function handle()
    {
        $this->info('Creating a new Iceman...');

        $email = $this->ask('Email');
        $password = $this->secret('Password');
        $confirmPassword = $this->secret('Confirm Password');

        if ($password !== $confirmPassword) {
            $this->error('Passwords do not match!');
            return 1;
        }

        $validator = Validator::make([
            'email' => $email,
            'password' => $password,
        ], [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:icemen'], 
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return 1;
        }

        $iceman = Iceman::create([
            'email' => $email,
            'password' => $password,
        ]);

        $this->info("Success! Iceman ({$iceman->email}) has been created.");
        return 0;
    }
}