<?php

namespace App\Http\Requests\Rooms;

use Illuminate\Foundation\Http\FormRequest;

class BedTypeRequest extends FormRequest
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
            "name" => ["required", "string", "max:255"]
        ];
    }

    public function messages(): array
    {
        return [
            "name.required" => "Nama tipe kasur wajib diisi.",
            "name.string" => "Nama tipe kasur harus berupa string.",
            "name.max" => "Nama tipe kasur maksimal 255 karakter.",
        ];
    }
}
