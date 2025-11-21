<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Plan;
use App\Models\Transaction;
use App\Models\Subscription;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Exception;

class SubscriptionController extends Controller
{
    public function subscribe(Plan $plan)
    {
        $user = Auth::user();
        $price = $plan->price;

        try {
            return DB::transaction(function () use ($user, $plan, $price) {
                
                $hasSiblingSubscription = $user->subscriptions()
                    ->whereHas('plan', function ($q) use ($plan) {
                        $q->where('service_id', $plan->service_id);
                    })
                    ->where('plan_id', '!=', $plan->id)
                    ->where(function ($q) {
                        $q->where('status', 'active')
                          ->orWhere(function ($subQ) {
                              $subQ->where('status', 'canceled')
                                   ->where('end_date', '>', Carbon::now());
                          });
                    })
                    ->exists();

                if ($hasSiblingSubscription) {
                    return response()->json(['error' => 'You already have an active subscription for this service.'], 400);
                }

                $account = $user->account()->lockForUpdate()->first();
                
                $existingSubscription = $user->subscriptions()
                                             ->where('plan_id', $plan->id)
                                             ->lockForUpdate()
                                             ->first();

                if ($existingSubscription) {
                    if ($existingSubscription->status === 'active') {
                        return response()->json(['error' => 'You are already subscribed to this plan.'], 400);
                    }

                    if ($existingSubscription->status === 'canceled') {
                        if (Carbon::now()->lessThan($existingSubscription->end_date)) {
                            $existingSubscription->status = 'active';
                            $existingSubscription->save();

                            return response()->json([
                                'message' => 'Your subscription has been reactivated.',
                                'new_balance' => $account->balance,
                                'status' => 'reactivated' // Frontend can use this flag if needed
                            ], 200);
                        }
                    }
                }

                if ($account->balance < $price) {
                    return response()->json(['error' => 'Insufficient balance.'], 400);
                }

                $account->balance -= $price;
                $account->save();

                $transaction = Transaction::create([
                    'account_id' => $account->id,
                    'type' => 'pay_plan',
                    'amount' => -$price,
                    'description' => $existingSubscription 
                        ? "Resubscribed to " . $plan->name 
                        : "Subscribed to " . $plan->name,
                    'related_plan_id' => $plan->id,
                ]);

                if ($existingSubscription) {
                    $existingSubscription->update([
                        'transaction_id' => $transaction->id,
                        'status' => 'active',
                        'end_date' => Carbon::now()->addDays($plan->duration), 
                    ]);
                } else {
                    Subscription::create([
                        'user_id' => $user->id,
                        'plan_id' => $plan->id,
                        'transaction_id' => $transaction->id,
                        'status' => 'active',
                        'end_date' => Carbon::now()->addDays($plan->duration),
                    ]);
                }

                return response()->json([
                    'message' => 'Successfully subscribed to ' . $plan->name,
                    'new_balance' => $account->balance
                ], 200);
            });

        } catch (Exception $e) {
            Log::error('Subscription failed for user ' . $user->id . ': ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred during the subscription.'], 500);
        }
    }

    public function reactivate(Plan $plan)
    {
        $user = Auth::user();

        $subscription = $user->subscriptions()
            ->where('plan_id', $plan->id)
            ->where('status', 'canceled')
            ->where('end_date', '>', Carbon::now())
            ->first();

        if (!$subscription) {
            return response()->json([
                'error' => 'No valid cancelled subscription found to reactivate.'
            ], 400);
        }

        $subscription->update([
            'status' => 'active'
        ]);

        return response()->json([
            'message' => 'Subscription reactivated successfully!',
        ]);
    }

    public function cancel(Subscription $subscription)
    {
        $this->authorize('cancel', $subscription);

        if ($subscription->status !== 'active') {
            return back()->withErrors(['message' => 'This subscription is already inactive.']);
        }

        $subscription->status = 'canceled';
        $subscription->save();

        return back()->with('message', 'Subscription cancelled successfully.');
    }
}