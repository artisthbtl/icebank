<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Subscription;
use App\Http\Requests\V1\UpdateSubscriptionRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\SubscriptionResource;
use App\Http\Resources\V1\SubscriptionCollection;
use App\Models\Plan;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Exception;
use Carbon\Carbon;
use Auth;

class SubscriptionController extends Controller
{
    public function index()
    {
        return new SubscriptionCollection(Subscription::paginate());
    }

    public function show(Subscription $subscription)
    {
        return new SubscriptionResource($subscription);
    }

    public function subscribe(Plan $plan)
    {
        $user = Auth::user();
        $account = $user->account;
        $price = $plan->price;

        $isActive = $user->subscriptions()
                         ->where('plan_id', $plan->id)
                         ->where('status', 'active')
                         ->exists();

        if ($isActive) {
            return response()->json(['error' => 'You are already subscribed to this plan.'], 400);
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
            return response()->json(['error' => 'An error occurred during the subscription.'], 500);
        }

        return response()->json([
            'message' => 'Successfully subscribed to ' . $plan->name,
            'new_balance' => $account->balance
        ], 200);
    }

    public function cancel(Subscription $subscription)
    {
        $this->authorize('delete', $subscription);

        if ($subscription->status !== 'active') {
            return response()->json(['error' => 'This subscription is already inactive.'], 400);
        }

        $subscription->status = 'cancelled';
        $subscription->save();

        return response()->json(['message' => 'Subscription has been cancelled successfully.'], 200);
    }
}
