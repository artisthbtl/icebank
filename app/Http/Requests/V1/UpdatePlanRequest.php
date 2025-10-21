<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:1',
            'duration' => 'sometimes|integer|min:1',
        ];
    }
}
