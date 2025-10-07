<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Company;
use App\Models\Plan;
use App\Models\Service;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // --- SCENARIO 1: CREATE A MAIN "POWER USER" FOR EASY TESTING ---
        // This user will have a rich history of transactions and subscriptions.
        $powerUser = User::factory()
            ->has(Account::factory(['balance' => 50000])) // Create a user with one account that has a high balance
            ->create([
                'first_name' => 'Marcello',
                'last_name' => 'Kusumo',
                'email' => 'marcello@icebank.test',
            ]);

        // --- SCENARIO 2: CREATE A BATCH OF RANDOM USERS ---
        // These users will be recipients for transfers and have their own simple histories.
        $randomUsers = User::factory()
            ->count(20)
            ->has(Account::factory()) // Every user gets one account
            ->create();

        // --- SCENARIO 3: CREATE COMPANIES, SERVICES, AND PLANS ---
        // We'll create a few companies, each with its own set of services and plans.
        $netflix = Company::factory()->create(['name' => 'Netflix']);
        $spotify = Company::factory()->create(['name' => 'Spotify']);
        $gym = Company::factory()->create(['name' => 'IceGym']);

        // Create a service and a plan for Netflix
        $netflixService = Service::factory()->for($netflix)->create(['name' => 'Video Streaming', 'type' => 'Entertainment']);
        $netflixPlan = Plan::factory()->for($netflixService)->create(['price' => 15.99, 'duration' => 30]);

        // Create a service and multiple plans for Spotify
        $spotifyService = Service::factory()->for($spotify)->create(['name' => 'Music Streaming', 'type' => 'Entertainment']);
        Plan::factory()->for($spotifyService)->create(['price' => 9.99, 'duration' => 30]);
        Plan::factory()->for($spotifyService)->create(['price' => 99.99, 'duration' => 365]);

        // Create multiple services and plans for the Gym
        $gymService = Service::factory()->for($gym)->create(['name' => 'Gym Membership', 'type' => 'Lifestyle']);
        $yogaService = Service::factory()->for($gym)->create(['name' => 'Yoga Classes', 'type' => 'Lifestyle']);
        $gymPlan = Plan::factory()->for($gymService)->create(['price' => 45.00, 'duration' => 30]);
        Plan::factory()->for($yogaService)->create(['price' => 60.00, 'duration' => 30]);


        // --- SCENARIO 4: POPULATE THE POWER USER'S TRANSACTION HISTORY ---

        // Give the power user several "add_balance" transactions
        Transaction::factory()->count(5)->for($powerUser->account)->create();

        // Create several "transfer" transactions FROM the power user TO random users
        Transaction::factory()
            ->count(3)
            ->for($powerUser->account)
            ->transfer()
            ->create([
                // Override the factory to pick one of our existing random users as the recipient
                'related_account_id' => $randomUsers->random()->account->id,
            ]);

        // Create several subscriptions for the power user. The SubscriptionFactory will
        // automatically create the 'pay_plan' transaction behind the scenes.
        Subscription::factory()->create([
            'user_id' => $powerUser->id,
            'plan_id' => $netflixPlan->id,
        ]);
        Subscription::factory()->create([
            'user_id' => $powerUser->id,
            'plan_id' => $gymPlan->id,
        ]);


        // --- SCENARIO 5: GIVE RANDOM USERS SOME ACTIVITY ---
        
        // Let's make some of the random users have a few transactions as well
        foreach ($randomUsers->take(5) as $user) {
            // Give them a couple of balance top-ups
            Transaction::factory()->count(2)->for($user->account)->create();

            // Give them one subscription
            Subscription::factory()->create(['user_id' => $user->id]);
        }
    }
}