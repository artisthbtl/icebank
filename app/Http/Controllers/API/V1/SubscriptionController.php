<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Subscription;
use App\Http\Requests\V1\StoreSubscriptionRequest;
use App\Http\Requests\V1\UpdateSubscriptionRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\SubscriptionResource;
use App\Http\Resources\V1\SubscriptionCollection;

class SubscriptionController extends Controller
{
    public function index()
    {
        return new SubscriptionCollection(Subscription::paginate());
    }

    public function store(StoreSubscriptionRequest $request)
    {
        //
    }

    public function show(Subscription $subscription)
    {
        return new SubscriptionResource($subscription);
    }

    public function update(UpdateSubscriptionRequest $request, Subscription $subscription)
    {
        //
    }

    public function destroy(Subscription $subscription)
    {
        //
    }
}
