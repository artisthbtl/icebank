<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pin' => 'required|string|digits:6',
            'amount' => 'required|numeric|min:1|max:1000000.00',
            'receiverAccountNumber' => 'required|string|exists:accounts,account_number,deleted_at,NULL',
        ];
    }

    public function messages(): array
    {
        return [
            'amount.max' => 'The amount entered is too large.',
            'amount.min' => 'The amount must be at least 0.01.',
            'receiverAccountNumber.exists' => 'That account number does not exist.',
        ];
    }
}
