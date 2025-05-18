<?php

namespace App\Http\Requests\Rooms;

use Illuminate\Foundation\Http\FormRequest;

class RoomTypeRequest extends FormRequest
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
            "capacity" => ["required", "integer"],
            "base_rate" => ["required", "numeric"],
        ];
    }

    public function messages(): array
    {
        return [
            "name.required" => "Nama tipe kamar wajib diisi.",
            "name.string" => "Nama tipe kamar harus berupa string.",
            "name.max" => "Nama tipe kamar maksimal 255 karakter.",
            "capacity.required" => "Kapasitas tipe kamar wajib diisi.",
            "capacity.integer" => "Kapasitas tipe kamar harus berupa angka.",
            "base_rate.required" => "Tarif dasar tipe kamar wajib diisi.",
            "base_rate.numeric" => "Tarif dasar tipe kamar harus berupa angka.",
        ];
    }
}
