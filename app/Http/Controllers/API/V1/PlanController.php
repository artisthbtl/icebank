<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Plan;
use App\Http\Requests\V1\StorePlanRequest;
use App\Http\Requests\V1\UpdatePlanRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PlanResource;
use App\Http\Resources\V1\PlanCollection;

class PlanController extends Controller
{
    public function index()
    {
        return new PlanCollection(Plan::paginate());
    }

    public function store(StorePlanRequest $request)
    {
        $plan = Plan::create([
            'service_id' => $request->input('serviceId'),
            'name' => $request->input('name'),
            'price' => $request->input('price'),
            'duration' => $request->input('duration'),
        ]);

        return new PlanResource($plan);
    }

    public function show(Plan $plan)
    {
        return new PlanResource($plan);
    }

    public function update(UpdatePlanRequest $request, Plan $plan)
    {
        $data = $request->validated();
        $plan->update($data);

        return new PlanResource($plan);
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();

        return response()->json(['message' => 'Plan deleted successfully.'], 200);
    }
}
