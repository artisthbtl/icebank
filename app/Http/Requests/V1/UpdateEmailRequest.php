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
            'newEmail' => [
                'required',
                'email',
                'unique:users,email',
                function ($attribute, $value, $fail) {
                    if ($value === $this->user()->email) {
                        $fail('The new email must be different from your current email.');
                    }
                },
            ],
            'pin' => 'required|string|digits:6'
        ];
    }
}
