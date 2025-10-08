<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\TransactionResource;
use App\Http\Resources\V1\TransactionCollection;

class TransactionController extends Controller
{
    public function index()
    {
        return new TransactionCollection(Transaction::paginate());
    }

    public function create()
    {
        //
    }

    public function store(StoreTransactionRequest $request)
    {
        //
    }

    public function show(Transaction $transaction)
    {
        return new TransactionResource($transaction);
    }

    public function edit(Transaction $transaction)
    {
        //
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        //
    }

    public function destroy(Transaction $transaction)
    {
        //
    }
}
