<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'currentPin' => 'required|string|digits:6',
            'newPin' => 'required|string|digits:6|same:newPinConfirmation',
        ];
    }
}
