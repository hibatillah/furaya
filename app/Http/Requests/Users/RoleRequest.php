<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
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
            "name" => ["required", "string", "max:255", Rule::unique("roles", "name")->ignore($id)],
        ];
    }

    public function messages(): array
    {
        return [
            "name.required" => "Nama role wajib diisi.",
            "name.string" => "Nama role harus berupa string.",
            "name.max" => "Nama role maksimal 255 karakter.",
            "name.unique" => "Nama role sudah ada.",
        ];
    }
}
