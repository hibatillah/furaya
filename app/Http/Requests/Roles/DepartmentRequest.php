<?php

namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;

class DepartmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = Request::route('id');

        return [
            "name" => ["required", "string", "max:255", Rule::unique("departments", "name")->ignore($id)],
        ];
    }

    public function messages(): array
    {
        return [
            "name.required" => "Nama departemen wajib diisi.",
            "name.string" => "Nama departemen harus berupa string.",
            "name.max" => "Nama departemen maksimal 255 karakter.",
            "name.unique" => "Nama departemen sudah ada.",
        ];
    }
}
