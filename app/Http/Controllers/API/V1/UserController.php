<?php

namespace App\Http\Controllers\API\V1;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\UserResource;
use App\Http\Resources\V1\UserCollection;
use App\Http\Requests\V1\StorePinRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return new UserCollection(User::paginate());
    }

    public function store(Request $request)
    {
        //
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }

    public function update(Request $request, User $user)
    {
        //
    }

    public function destroy(User $user)
    {
        //
    }
   
    public function createPin()
    {
        return view('auth.create-pin');
    }

    public function storePin(StorePinRequest $request)
    {
        $user = Auth::user();

        if (!is_null($user->pin)) {
            return response()->json(['message' => 'PIN already set.'], 409);
        }

        $user->pin = Hash::make($request->pin);
        $user->save();

        return response()->json(['message' => 'PIN created successfully.']);
    }

    public function updatePin(StorePinRequest $request)
    {
        $user = Auth::user();

        $user->pin = Hash::make($request->pin);
        $user->save();

        return response()->json(['message' => 'PIN updated successfully.']);
    }
}
