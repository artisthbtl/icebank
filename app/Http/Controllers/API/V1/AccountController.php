<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Account;
use App\Http\Requests\V1\StoreAccountRequest;
use App\Http\Requests\V1\UpdateAccountRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AccountResource;
use App\Http\Resources\V1\AccountCollection;

class AccountController extends Controller
{
    public function index()
    {
        return new AccountCollection(Account::paginate());
    }

    public function store(StoreAccountRequest $request)
    {
        //
    }

    public function show(Account $account)
    {
        return new AccountResource($account);
    }

    public function update(UpdateAccountRequest $request, Account $account)
    {
        //
    }

    public function destroy(Account $account)
    {
        //
    }
}
