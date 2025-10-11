<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Company;
use App\Http\Requests\V1\StoreCompanyRequest;
use App\Http\Requests\V1\UpdateCompanyRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CompanyResource;
use App\Http\Resources\V1\CompanyCollection;

class CompanyController extends Controller
{
    public function index()
    {
        return new CompanyCollection(Company::paginate());
    }

    public function create()
    {
        //
    }

    public function store(StoreCompanyRequest $request)
    {
        //
    }

    public function show(Company $company)
    {
        return new CompanyResource($company);
    }

    public function edit(Company $company)
    {
        //
    }

    public function update(UpdateCompanyRequest $request, Company $company)
    {
        //
    }

    public function destroy(Company $company)
    {
        //
    }
}
