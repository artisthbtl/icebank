<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Http\Resources\V1\ServiceCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rule;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class SubscribeController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $availableTypes = Service::select('type')->distinct()->pluck('type')->toArray();

        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'], 
            'type'   => ['nullable', 'string', Rule::in(array_merge(['all'], $availableTypes))],
        ]);

        $search = isset($validated['search']) ? strip_tags($validated['search']) : null;
        $type = $validated['type'] ?? 'all';

        $query = Service::query()
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

            ->when($type && $type !== 'all', function (Builder $query) use ($type) {
                $query->where('type', $type);
            })
            
            ->latest();

        $page = $request->integer('page', 1);
        $perPage = 10;
        
        $isPartial = $request->header('X-Inertia-Partial-Data') !== null;

        if (!$isPartial && $page > 1) {
            $totalItemsToFetch = $page * $perPage;
            
            $total = $query->clone()->count();
            
            $items = $query->take($totalItemsToFetch)->get();

            $services = new LengthAwarePaginator(
                $items,
                $total,
                $perPage,
                $page,
                [
                    'path' => LengthAwarePaginator::resolveCurrentPath(),
                    'query' => $request->query(), // Preserve search/filter params
                ]
            );
        } else {
            $services = $query->paginate($perPage)->withQueryString();
        }

        return Inertia::render('SubscribePage', [
            'services' => new ServiceCollection($services),
            'filters' => [
                'search' => $search,
                'type' => $type
            ],
            'types' => $availableTypes,
        ]);
    }
}