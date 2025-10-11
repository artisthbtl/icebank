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

    public function create()
    {
        //
    }

    public function store(StorePlanRequest $request)
    {
        //
    }

    public function show(Plan $plan)
    {
        return new PlanResource($plan);
    }

    public function edit(Plan $plan)
    {
        //
    }

    public function update(UpdatePlanRequest $request, Plan $plan)
    {
        //
    }

    public function destroy(Plan $plan)
    {
        //
    }
}
