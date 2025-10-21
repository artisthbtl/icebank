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

    public function rules(): array
    {
        return [
            'companyId' => 'required|exists:companies,id',
            'name' => 'required|string|max:255',
            'type' => ['nullable', new Enum(CompanyTypeEnum::class)],
            'description' => 'nullable|string',
        ];
    }
}
