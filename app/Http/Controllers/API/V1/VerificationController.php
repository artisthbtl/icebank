<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Verification;
use App\Http\Requests\V1\StoreVerificationRequest;
use App\Http\Requests\V1\UpdateVerificationRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\VerificationResource;
use App\Http\Resources\V1\VerificationCollection;

class VerificationController extends Controller
{
    public function index()
    {
        return new VerificationCollection(Verification::paginate());
    }

    public function create()
    {
        //
    }

    public function store(StoreVerificationRequest $request)
    {
        //
    }

    public function show(Verification $verification)
    {
        return new VerificationResource($verification);
    }

    public function edit(Verification $verification)
    {
        //
    }

    public function update(UpdateVerificationRequest $request, Verification $verification)
    {
        //
    }

    public function destroy(Verification $verification)
    {
        //
    }
}
