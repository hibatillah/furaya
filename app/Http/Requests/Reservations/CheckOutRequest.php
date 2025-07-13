<?php

namespace App\Http\Requests\Reservations;

use App\Enums\RoomStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckOutRequest extends FormRequest
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
            "reservation_id" => ["required", "string", Rule::exists("reservations", "id")],
            "check_out_at" => ["required", "date"],
            "check_out_by" => ["required", "string", "max:255"],
            "employee_id" => ["required", "string", Rule::exists("employees", "id")],
            "additional_charge" => ["nullable", "numeric"],
            "notes" => ["nullable", "string", "max:255"],
            "room_status" => ["required", "string", Rule::in(RoomStatusEnum::getValues())],
        ];
    }

    public function messages(): array
    {
        return [
            "reservation_id.required" => "Reservation ID wajib diisi.",
            "reservation_id.string" => "Reservation ID harus berupa string.",
            "reservation_id.exists" => "Reservation ID tidak ditemukan.",
            "check_out_at.required" => "Tanggal check-out wajib diisi.",
            "check_out_at.date" => "Tanggal check-out harus berupa tanggal.",
            "check_out_by.required" => "Nama pegawai wajib diisi.",
            "check_out_by.string" => "Nama pegawai harus berupa string.",
            "check_out_by.max" => "Nama pegawai maksimal 255 karakter.",
            "employee_id.required" => "Employee ID wajib diisi.",
            "employee_id.string" => "Employee ID harus berupa string.",
            "employee_id.exists" => "Employee ID tidak ditemukan.",
            "additional_charge.numeric" => "Additional charge harus berupa angka.",
            "notes.string" => "Catatan harus berupa string.",
            "notes.max" => "Catatan maksimal 255 karakter.",
            "room_status.required" => "Status kamar wajib diisi.",
            "room_status.string" => "Status kamar harus berupa string.",
            "room_status.in" => "Status kamar tidak valid.",
        ];
    }
}
