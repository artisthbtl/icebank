<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Service;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ServiceResource;
use App\Http\Resources\V1\ServiceCollection;

class ServiceController extends Controller
{
    public function index()
    {
        return new ServiceCollection(Service::paginate());
    }

    public function create()
    {
        //
    }

    public function store(StoreServiceRequest $request)
    {
        //
    }

    public function show(Service $service)
    {
        return new ServiceResource($service);
    }

    public function edit(Service $service)
    {
        //
    }

    public function update(UpdateServiceRequest $request, Service $service)
    {
        //
    }

    public function destroy(Service $service)
    {
        //
    }
}
