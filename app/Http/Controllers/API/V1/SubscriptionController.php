<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Plan;
use App\Models\Transaction;
use App\Models\Subscription;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\SubscriptionResource;
use App\Http\Resources\V1\SubscriptionCollection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
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
                                'message' => 'Your subscription has been reactivated. It will renew on ' . Carbon::parse($existingSubscription->end_date)->toFormattedDateString(),
                                'new_balance' => $account->balance
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