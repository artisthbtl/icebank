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
use Illuminate\Http\Request;
use Carbon\Carbon;
use Exception;
use Auth;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $subscriptions = $user->subscriptions()
                              ->with('plan.service.company')
                              ->orderBy('created_at', 'desc')
                              ->paginate();

        return new SubscriptionCollection($subscriptions);
    }

    public function show(Subscription $subscription)
    {
        $this->authorize('view', $subscription);

        $subscription->load('plan.service.company');

        return new SubscriptionResource($subscription);
    }

    public function subscribe(Plan $plan)
    {
        $user = Auth::user();
        $account = $user->account;
        $price = $plan->price;

        $existingSubscription = $user->subscriptions()
                                     ->where('plan_id', $plan->id)
                                     ->first();

        if ($existingSubscription) {
            if ($existingSubscription->status === 'active') {
                return response()->json(['error' => 'You are already subscribed to this plan.'], 400);
            }

            if ($existingSubscription->status === 'canceled') {
                $existingSubscription->status = 'active';
                $existingSubscription->save();

                return response()->json([
                    'message' => 'Your subscription to ' . $plan->name . ' has been reactivated. It will renew on ' . Carbon::parse($existingSubscription->end_date)->toFormattedDateString(),
                ], 200);
            }


            if ($existingSubscription->status === 'expired') {
                if ($account->balance < $price) {
                    return response()->json(['error' => 'Insufficient balance to resubscribe.'], 400);
                }

                try {
                    DB::transaction(function () use ($user, $account, $plan, $price, $existingSubscription) {
                        $account->balance -= $price;
                        $account->save();

                        $transaction = Transaction::create([
                            'account_id' => $account->id,
                            'type' => 'pay_plan',
                            'amount' => -$price,
                            'description' => "Resubscribed to " . $plan->name,
                            'related_plan_id' => $plan->id,
                        ]);

                        $existingSubscription->update([
                            'transaction_id' => $transaction->id,
                            'status' => 'active',
                            'end_date' => Carbon::now()->addDays($plan->duration),
                        ]);
                    });

                } catch (Exception $e) {
                    Log::error('Resubscription failed for user ' . $user->id . ': ' . $e->getMessage());
                    return response()->json(['error' => 'An error occurred during the resubscription.'], 500);
                }

                return response()->json([
                    'message' => 'Successfully resubscribed to ' . $plan->name,
                    'new_balance' => $account->balance
                ], 200);
            }
        }

        if ($account->balance < $price) {
            return response()->json(['error' => 'Insufficient balance to subscribe.'], 400);
        }

        try {
            DB::transaction(function () use ($user, $account, $plan, $price) {
                $account->balance -= $price;
                $account->save();

                $transaction = Transaction::create([
                    'account_id' => $account->id,
                    'type' => 'pay_plan',
                    'amount' => -$price,
                    'description' => "Subscribed to " . $plan->name,
                    'related_plan_id' => $plan->id,
                ]);

                Subscription::create([
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                    'transaction_id' => $transaction->id,
                    'status' => 'active',
                    'end_date' => Carbon::now()->addDays($plan->duration),
                ]);
            });

        } catch (Exception $e) {
            Log::error('New subscription failed for user ' . $user->id . ': ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred during the subscription.'], 500);
        }

        return response()->json([
            'message' => 'Successfully subscribed to ' . $plan->name,
            'new_balance' => $account->balance
        ], 200);
    }

    public function cancel(Subscription $subscription)
    {
        $this->authorize('cancel', $subscription);

        if ($subscription->status !== 'active') {
            return response()->json(['error' => 'This subscription is already inactive.'], 400);
        }

        $subscription->status = 'canceled';
        $subscription->save();

        return response()->json([
            'message' => 'Subscription has been cancelled successfully. It will remain active until ' . Carbon::parse($subscription->end_date)->toFormattedDateString()
        ], 200);
    }
}