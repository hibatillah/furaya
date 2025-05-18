<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ["required", "string", "max:255"],
        ];
    }

    public function messages(): array
    {
        return [
            "name.required" => "Nama role wajib diisi.",
            "name.string" => "Nama role harus berupa string.",
            "name.max" => "Nama role maksimal 255 karakter.",
        ];
    }
}
