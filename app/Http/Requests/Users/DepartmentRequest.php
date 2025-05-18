<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class DepartmentRequest extends FormRequest
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
            "name.required" => "Nama departemen wajib diisi.",
            "name.string" => "Nama departemen harus berupa string.",
            "name.max" => "Nama departemen maksimal 255 karakter.",
        ];
    }
}
