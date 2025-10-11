<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Verification;
use App\Http\Requests\V1\StoreVerificationRequest;
use App\Http\Requests\V1\UpdateVerificationRequest;
use App\Http\Controllers\Controller;

class VerificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVerificationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Verification $verification)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Verification $verification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVerificationRequest $request, Verification $verification)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Verification $verification)
    {
        //
    }
}
