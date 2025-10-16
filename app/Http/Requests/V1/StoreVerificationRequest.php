<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreVerificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ktpImage' => 'required|image|mimes:jpeg,png,jpg|max:2048', // 2MB Max
            'selfieImage' => 'required|image|mimes:jpeg,png,jpg|max:2048', // 2MB Max
        ];
    }
}
