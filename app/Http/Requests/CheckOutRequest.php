<?php

namespace App\Http\Requests;

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
            "checked_out_at" => ["required", "datetime"],
            "employee_id" => ["required", "string", Rule::exists("employees", "id")],
            "final_total" => ["required", "numeric"],
            "notes" => ["nullable", "string", "max:255"],
        ];
    }

    public function messages(): array
    {
        return [
            "reservation_id.required" => "Reservation ID wajib diisi.",
            "reservation_id.string" => "Reservation ID harus berupa string.",
            "reservation_id.exists" => "Reservation ID tidak ditemukan.",
            "checked_out_at.required" => "Tanggal check-out wajib diisi.",
            "checked_out_at.datetime" => "Tanggal check-out harus berupa tanggal.",
            "employee_id.required" => "Employee ID wajib diisi.",
            "employee_id.string" => "Employee ID harus berupa string.",
            "employee_id.exists" => "Employee ID tidak ditemukan.",
            "final_total.required" => "Final total wajib diisi.",
            "final_total.numeric" => "Final total harus berupa angka.",
            "notes.string" => "Catatan harus berupa string.",
            "notes.max" => "Catatan maksimal 255 karakter.",
        ];
    }
}
