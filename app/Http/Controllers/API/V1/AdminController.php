<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Admin;
use App\Http\Requests\V1\StoreAdminRequest;
use App\Http\Requests\V1\UpdateAdminRequest;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    public function index()
    {
        //
    }

    public function store(StoreAdminRequest $request)
    {
        //
    }

    public function show(Admin $admin)
    {
        //
    }

    public function update(UpdateAdminRequest $request, Admin $admin)
    {
        //
    }

    public function destroy(Admin $admin)
    {
        //
    }
}
