<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Service;
use App\Models\Plan;
use App\Http\Requests\V1\StoreCompanyRequest;
use App\Http\Requests\V1\UpdateCompanyRequest;
use App\Http\Requests\V1\StoreServiceRequest;
use App\Http\Requests\V1\UpdateServiceRequest;
use App\Http\Requests\V1\StorePlanRequest;
use App\Http\Requests\V1\UpdatePlanRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IcemanManageServicesController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::query()->withCount('services');
        
        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        return Inertia::render('Iceman/ManageCompaniesPage', [
            'companies' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function storeCompany(StoreCompanyRequest $request)
    {
        $logoPath = $request->file('logo')->store('company_logos', 'public');
        
        Company::create([
            'name' => $request->name,
            'logo_path' => $logoPath,
        ]);

        return redirect()->back();
    }

    public function updateCompany(UpdateCompanyRequest $request, Company $company)
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            if ($company->logo_path) Storage::disk('public')->delete($company->logo_path);
            $data['logo_path'] = $request->file('logo')->store('company_logos', 'public');
        }

        $company->update($data);
        return redirect()->back();
    }

    public function showCompany(Company $company)
    {
        return Inertia::render('Iceman/ManageCompanyServicesPage', [
            'company' => $company,
            'services' => $company->services()->withCount('plans')->paginate(10),
        ]);
    }

    public function storeService(StoreServiceRequest $request, Company $company)
    {
        $company->services()->create([
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
        ]);

        return redirect()->back();
    }

    public function updateService(UpdateServiceRequest $request, Service $service)
    {
        $service->update($request->validated());
        return redirect()->back();
    }

    public function showService(Service $service)
    {
        $service->load('company');
        
        return Inertia::render('Iceman/ManageServicePlansPage', [
            'service' => $service,
            'plans' => $service->plans()->paginate(10),
        ]);
    }

    public function storePlan(StorePlanRequest $request, Service $service)
    {
        $service->plans()->create([
            'name' => $request->name,
            'price' => $request->price,
            'duration' => $request->duration,
        ]);

        return redirect()->back();
    }

    public function updatePlan(UpdatePlanRequest $request, Plan $plan)
    {
        $plan->update($request->validated());
        return redirect()->back();
    }
}