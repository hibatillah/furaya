<?php

namespace App\Http\Requests\Rooms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;

class RoomTypeRequest extends FormRequest
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
            "name" => ["required", "string", "max:255", Rule::unique("room_types", "name")->ignore($id)],
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
            "name.unique" => "Nama tipe kamar sudah ada.",
            "capacity.required" => "Kapasitas tipe kamar wajib diisi.",
            "capacity.integer" => "Kapasitas tipe kamar harus berupa angka.",
            "base_rate.required" => "Tarif dasar tipe kamar wajib diisi.",
            "base_rate.numeric" => "Tarif dasar tipe kamar harus berupa angka.",
        ];
    }
}
