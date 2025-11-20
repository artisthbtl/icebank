<?php

namespace App\Console\Commands\V1;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Mail\SubscriptionRenewedMail;
use App\Mail\SubscriptionExpiredMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Exception;

class RenewSubscription extends Command
{
    protected $signature = 'subscriptions:renew';
    protected $description = 'Renew active subscriptions or expire them if balance is insufficient';

    public function handle()
    {
        $subscriptionsToRenew = Subscription::where('status', 'active')
                                            ->where('end_date', '<=', Carbon::now())
                                            ->with(['user.account', 'plan']) // Eager load relationships
                                            ->get();

        if ($subscriptionsToRenew->isEmpty()) {
            $this->info('No subscriptions pending renewal.');
            return 0;
        }

        $this->info("Found " . $subscriptionsToRenew->count() . " subscriptions to process...");

        foreach ($subscriptionsToRenew as $sub) {
            $user = $sub->user;
            $plan = $sub->plan;

            if (!$user || !$user->account || !$plan) {
                $sub->status = 'expired';
                $sub->save();
                $this->warn("Skipped Sub ID: {$sub->id} (Missing User, Account, or Plan data)");
                continue;
            }

            try {
                DB::transaction(function () use ($sub, $user, $plan) {
                    $account = $user->account()->lockForUpdate()->first();
                    $price = $plan->price;

                    if ($account->balance >= $price) {
                        $account->balance -= $price;
                        $account->save();

                        $transaction = Transaction::create([
                            'account_id' => $account->id,
                            'type' => 'pay_plan',
                            'amount' => -$price,
                            'description' => "Auto-renewal for " . $plan->name,
                            'related_plan_id' => $plan->id,
                        ]);

                        $sub->update([
                            'transaction_id' => $transaction->id,
                            'end_date' => Carbon::now()->addDays($plan->duration),
                        ]);

                        Mail::to($user->email)->send(new SubscriptionRenewedMail($user, $plan, $transaction));

                        $this->info("Renewed Sub ID: {$sub->id} for User: {$user->email}");

                    } 
                    else {
                        $sub->update(['status' => 'expired']);

                        Mail::to($user->email)->send(new SubscriptionExpiredMail($user, $plan));

                        $this->warn("Expired Sub ID: {$sub->id} for User: {$user->email} (Insufficient funds)");
                    }
                });

            } catch (Exception $e) {
                Log::error("Failed to renew Sub ID: {$sub->id} - " . $e->getMessage());
                $this->error("Error processing Sub ID: {$sub->id}");
            }
        }

        $this->info('All subscriptions processed.');
        return 0;
    }
}