<?php

namespace App\Console\Commands\V1;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Exception;

class RenewSubscription extends Command
{
    protected $signature = 'subscriptions:renew';

    protected $description = 'Renew all active subscriptions that are due';

    public function handle()
    {
        $subscriptionsToRenew = Subscription::where('status', 'active')
                                    ->where('end_date', '<=', Carbon::now())
                                    ->with('user.account', 'plan')
                                    ->get();

        if ($subscriptionsToRenew->isEmpty()) {
            $this->info('No subscriptions to renew.');
            return 0;
        }

        $this->info("Found " . $subscriptionsToRenew->count() . " subscriptions to process...");

        foreach ($subscriptionsToRenew as $sub) {
            $user = $sub->user;
            $account = $user->account;
            $plan = $sub->plan;
            $price = $plan->price;

            if (!$user || !$account || !$plan) {
                $sub->status = 'expired';
                $sub->save();
                $this->warn("Skipped Sub ID: {$sub->id} (Missing User/Account/Plan)");
                continue;
            }

            if ($account->balance >= $price) {
                try {
                    DB::transaction(function () use ($sub, $account, $plan, $price) {
                        $account->balance -= $price;
                        $account->save();

                        $transaction = Transaction::create([
                            'account_id' => $account->id,
                            'type' => 'pay_plan',
                            'amount' => -$price,
                            'description' => "Renewed subscription for " . $plan->name,
                            'related_plan_id' => $plan->id,
                        ]);

                        $sub->end_date = Carbon::now()->addDays($plan->duration);
                        $sub->transaction_id = $transaction->id;
                        $sub->save();
                    });
                    
                    $this->info("Renewed Sub ID: {$sub->id} for User ID: {$user->id}");
                    // send email

                } catch (Exception $e) {
                    Log::error("Failed to renew Sub ID: {$sub->id} - " . $e->getMessage());
                }

            } else {
                $sub->status = 'expired';
                $sub->save();
                $this->warn("Expired Sub ID: {$sub->id} for User ID: {$user->id} (Insufficient funds)");
                // send expired email
            }
        }

        $this->info('All subscriptions processed.');
        return 0;
    }
}
