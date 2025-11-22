<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    protected function prepareForValidation()
    {
        if ($this->has('name')) {
            $this->merge(['name' => strip_tags($this->name)]);
        }
    }

    public function rules(): array
    {
        return [
            'name'     => 'sometimes|string|max:255',
            'price'    => 'sometimes|numeric|min:1|max:100000',
            'duration' => 'sometimes|integer|min:1|max:3650',
        ];
    }
}