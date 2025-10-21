<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'serviceId' => 'required|exists:services,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'duration' => 'required|integer|min:1',
        ];
    }
}
