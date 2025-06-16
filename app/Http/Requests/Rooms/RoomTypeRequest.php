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
            "code" => ["required", "string", "max:5", Rule::unique("room_types", "code")->ignore($id)],
            "name" => ["required", "string", "max:255", Rule::unique("room_types", "name")->ignore($id)],
            "capacity" => ["required", "integer"],
            "base_rate" => ["required", "numeric", "min:0"],
            "rate_type_id" => ["required", "string", "exists:rate_types,id"],
            "facilities" => ["nullable", "array"],
            "facilities.*" => ["nullable", "string", "exists:facilities,id"],
        ];
    }

    public function messages(): array
    {
        return [
            "code.required" => "Kode tipe kamar wajib diisi.",
            "code.string" => "Kode tipe kamar harus berupa string.",
            "code.max" => "Kode tipe kamar maksimal 5 karakter.",
            "code.unique" => "Kode tipe kamar sudah ada.",
            "name.required" => "Nama tipe kamar wajib diisi.",
            "name.string" => "Nama tipe kamar harus berupa string.",
            "name.max" => "Nama tipe kamar maksimal 255 karakter.",
            "name.unique" => "Nama tipe kamar sudah ada.",
            "capacity.required" => "Kapasitas tipe kamar wajib diisi.",
            "capacity.integer" => "Kapasitas tipe kamar harus berupa angka.",
            "base_rate.required" => "Tarif dasar tipe kamar wajib diisi.",
            "base_rate.numeric" => "Tarif dasar tipe kamar harus berupa angka.",
            "base_rate.min" => "Tarif dasar tipe kamar harus lebih dari 0.",
            "rate_type_id.required" => "Tipe tarif tipe kamar wajib diisi.",
            "rate_type_id.string" => "Tipe tarif tipe kamar harus berupa string.",
            "rate_type_id.exists" => "Tipe tarif tipe kamar tidak ditemukan.",
            "facilities.array" => "Fasilitas tipe kamar harus berupa array.",
            "facilities.*.string" => "Fasilitas tipe kamar harus berupa string.",
            "facilities.*.exists" => "Fasilitas tipe kamar tidak ditemukan.",
        ];
    }
}
