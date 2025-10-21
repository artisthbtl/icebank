<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Service;
use App\Http\Requests\V1\StoreServiceRequest;
use App\Http\Requests\V1\UpdateServiceRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ServiceResource;
use App\Http\Resources\V1\ServiceCollection;

class ServiceController extends Controller
{
    public function index()
    {
        return new ServiceCollection(Service::paginate());
    }

    public function store(StoreServiceRequest $request)
    {
        $service = Service::create([
            'company_id' => $request->input('companyId'),
            'name' => $request->input('name'),
            'type' => $request->input('type'),
            'description' => $request->input('description'),
        ]);

        return new ServiceResource($service);
    }

    public function show(Service $service)
    {
        return new ServiceResource($service);
    }

    public function update(UpdateServiceRequest $request, Service $service)
    {
        $data = $request->validated();
        $service->update($data);

        return new ServiceResource($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(['message' => 'Service deleted successfully.'], 200);
    }
}
