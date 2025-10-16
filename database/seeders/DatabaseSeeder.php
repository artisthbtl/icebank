<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Company;
use App\Models\Plan;
use App\Models\Service;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Admin;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // CREATE A MAIN "POWER USER"
        $powerUser = User::factory()
            ->has(Account::factory(['balance' => 50000])) // Create a user with one account that has a high balance
            ->create([
                'first_name' => 'Marcello',
                'last_name' => 'Kusumo',
                'email' => 'marcello@icebank.test',
                'password' => bcrypt('pass'),
            ]);

        
        // CREATE ADMIN
        Admin::factory()->create();

        // CREATE A BATCH OF RANDOM USERS
        $randomUsers = User::factory()
            ->count(20)
            ->has(Account::factory()) // Every user gets one account
            ->create();

        // CREATE COMPANIES, SERVICES, AND PLANS
        $netflix = Company::factory()->create(['name' => 'Netflix']);
        $spotify = Company::factory()->create(['name' => 'Spotify']);
        $gym = Company::factory()->create(['name' => 'IceGym']);

        $netflixService = Service::factory()->for($netflix)->create(['name' => 'Video Streaming', 'type' => 'Entertainment']);
        $netflixPlan = Plan::factory()->for($netflixService)->create(['price' => 15.99, 'duration' => 30]);

        $spotifyService = Service::factory()->for($spotify)->create(['name' => 'Music Streaming', 'type' => 'Entertainment']);
        Plan::factory()->for($spotifyService)->create(['price' => 9.99, 'duration' => 30]);
        Plan::factory()->for($spotifyService)->create(['price' => 99.99, 'duration' => 365]);

        $gymService = Service::factory()->for($gym)->create(['name' => 'Gym Membership', 'type' => 'Lifestyle']);
        $yogaService = Service::factory()->for($gym)->create(['name' => 'Yoga Classes', 'type' => 'Lifestyle']);
        $gymPlan = Plan::factory()->for($gymService)->create(['price' => 45.00, 'duration' => 30]);
        Plan::factory()->for($yogaService)->create(['price' => 60.00, 'duration' => 30]);


        // POPULATE THE POWER USER'S TRANSACTION HISTORY
        Transaction::factory()->count(5)->for($powerUser->account)->create();

        Transaction::factory()
            ->count(3)
            ->for($powerUser->account)
            ->transfer()
            ->create([
                'related_account_id' => $randomUsers->random()->account->id,
            ]);

        Subscription::factory()->create([
            'user_id' => $powerUser->id,
            'plan_id' => $netflixPlan->id,
        ]);
        Subscription::factory()->create([
            'user_id' => $powerUser->id,
            'plan_id' => $gymPlan->id,
        ]);


        // GIVE RANDOM USERS SOME ACTIVITY
        foreach ($randomUsers->take(5) as $user) {
            Transaction::factory()->count(2)->for($user->account)->create();

            Subscription::factory()->create(['user_id' => $user->id]);
        }
    }
}