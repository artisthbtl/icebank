<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Http\Resources\V1\TransactionCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class TransactionHistoryController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $account = $user->account;

        if (!$account) {
            return redirect()->route('dashboard');
        }

        $query = Transaction::query()
            ->where(function ($q) use ($account) {
                $q->where('account_id', $account->id)
                  ->orWhere('related_account_id', $account->id);
            })
            ->with(['plan', 'senderAccount.user', 'receiverAccount.user'])
            ->latest();

        $page = $request->integer('page', 1);
        $perPage = 10;
        $isPartial = $request->header('X-Inertia-Partial-Data') !== null;

        if (!$isPartial && $page > 1) {
            $totalItemsToFetch = $page * $perPage;
            $total = $query->clone()->count();
            $items = $query->take($totalItemsToFetch)->get();

            $transactions = new LengthAwarePaginator(
                $items,
                $total,
                $perPage,
                $page,
                [
                    'path' => LengthAwarePaginator::resolveCurrentPath(),
                    'query' => $request->query(),
                ]
            );
        } else {
            $transactions = $query->paginate($perPage);
        }

        return Inertia::render('TransactionPage', [
            'transactions' => new TransactionCollection($transactions),
        ]);
    }
}