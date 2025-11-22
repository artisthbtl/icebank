<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\V1\CompanyTypeEnum;
use Illuminate\Validation\Rules\Enum;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    
    protected function prepareForValidation()
    {
        if ($this->has('description')) {
            $this->merge([
                'description' => strip_tags($this->description),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'type' => ['required', new Enum(CompanyTypeEnum::class)],
            'description' => 'nullable|string',
        ];
    }
}