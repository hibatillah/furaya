<?php

namespace App\Http\Requests\Rooms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoomFacilityRequest extends FormRequest
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
        return [
            "room_id" => ["required", "string", Rule::exists("rooms", "id")],
            "facility_id" => ["required", "string", Rule::exists("facilities", "id")],
            "quantity" => ["required", "integer"],
        ];
    }

    public function messages(): array
    {
        return [
            "room_id.required" => "Room ID wajib diisi.",
            "room_id.string" => "Room ID harus berupa string.",
            "room_id.exists" => "Room ID tidak ditemukan.",
            "facility_id.required" => "Facility ID wajib diisi.",
            "facility_id.string" => "Facility ID harus berupa string.",
            "facility_id.exists" => "Facility ID tidak ditemukan.",
            "quantity.required" => "Quantity wajib diisi.",
            "quantity.integer" => "Quantity harus berupa angka.",
        ];
    }
}
