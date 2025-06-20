<?php

namespace App\Http\Requests\Reservations;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckInRequest extends FormRequest
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
            "checked_in_at" => ["required", "datetime"],
            "check_in_by" => ["required", "string", "max:255"],
            "employee_id" => ["required", "string", Rule::exists("employees", "id")],
            "notes" => ["nullable", "string", "max:255"],
        ];
    }

    public function messages(): array
    {
        return [
            "reservation_id.required" => "Reservation ID wajib diisi.",
            "reservation_id.string" => "Reservation ID harus berupa string.",
            "reservation_id.exists" => "Reservation ID tidak ditemukan.",
            "checked_in_at.required" => "Tanggal check-in wajib diisi.",
            "checked_in_at.datetime" => "Tanggal check-in harus berupa tanggal.",
            "check_in_by.required" => "Nama pegawai wajib diisi.",
            "check_in_by.string" => "Nama pegawai harus berupa string.",
            "check_in_by.max" => "Nama pegawai maksimal 255 karakter.",
            "employee_id.required" => "Employee ID wajib diisi.",
            "employee_id.string" => "Employee ID harus berupa string.",
            "employee_id.exists" => "Employee ID tidak ditemukan.",
        ];
    }
}
