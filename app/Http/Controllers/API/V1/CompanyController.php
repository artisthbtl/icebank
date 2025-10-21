<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Company;
use App\Http\Requests\V1\StoreCompanyRequest;
use App\Http\Requests\V1\UpdateCompanyRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CompanyResource;
use App\Http\Resources\V1\CompanyCollection;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    public function index()
    {
        return new CompanyCollection(Company::paginate());
    }

    public function store(StoreCompanyRequest $request)
    {
        $logoPath = $request->file('logo')->store('company_logos', 'public');

        $company = Company::create([
            'name' => $request->input('name'),
            'logo_path' => $logoPath,
        ]);

        return new CompanyResource($company);
    }

    public function show(Company $company)
    {
        return new CompanyResource($company);
    }

    public function update(UpdateCompanyRequest $request, Company $company)
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            if ($company->logo_path) {
                Storage::disk('public')->delete($company->logo_path);
            }

            $logoPath = $request->file('logo')->store('company_logos', 'public');
            $data['logo_path'] = $logoPath;
        }

        $company->update($data);

        return new CompanyResource($company);
    }

    public function destroy(Company $company)
    {
        if ($company->logo_path) {
            Storage::disk('public')->delete($company->logo_path);
        }

        $company->delete();

        return response()->json(['message' => 'Company deleted successfully.'], 200);
    }
}
