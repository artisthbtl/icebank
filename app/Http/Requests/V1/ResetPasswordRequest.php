<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => [
                'required',
                'string',
                'same:passwordConfirmation',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ], 
        ];
    }
}
