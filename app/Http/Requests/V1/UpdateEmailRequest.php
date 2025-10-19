<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'newEmail' => 'required|email|unique:users,email',
            'pin' => 'required|string|digits:6'
        ];
    }
}
