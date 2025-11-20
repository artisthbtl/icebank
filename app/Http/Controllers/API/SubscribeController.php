<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Http\Resources\V1\ServiceCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;

class SubscribeController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $search = $request->input('search');
        $type = $request->input('type');

        $services = Service::query()
            ->with(['company', 'plans'])
            
            ->whereDoesntHave('plans.subscriptions', function (Builder $query) use ($user) {
                $query->where('user_id', $user->id)
                      ->where('status', 'active'); 
            })

            ->when($search, function (Builder $query, $search) {
                $query->whereHas('company', function (Builder $q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })

            ->when($type && $type !== 'all', function (Builder $query, $type) {
                $query->where('type', $type);
            })
            
            ->latest() 
            ->paginate(10)
            ->withQueryString();

        $serviceTypes = Service::select('type')->distinct()->pluck('type');

        return Inertia::render('SubscribePage', [
            'services' => new ServiceCollection($services),
            'filters' => $request->only(['search', 'type']),
            'types' => $serviceTypes,
        ]);
    }
}