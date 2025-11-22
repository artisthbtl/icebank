<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'logo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048|dimensions:ratio=1/1',
        ];
    }
    
    public function messages(): array
    {
        return [
            'logo.dimensions' => 'The logo must be a square image (e.g., 500x500 pixels) to fit correctly.',
        ];
    }
}