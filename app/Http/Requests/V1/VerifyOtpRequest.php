<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'otp' => 'required|string|digits:6',
        ];

        if ($this->is('auth/verify-otp')) {
            $rules['userId'] = 'required|exists:users,id';
        } else {
            $rules['icemanId'] = 'required|exists:icemen,id';
        }

        return $rules;
    }
}