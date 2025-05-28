<?php

namespace App\Http\Requests;

use App\Enums\RoomStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoomStatusRequest extends FormRequest
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
            "employee_id" => ["required", "string", "exist:employees,id"],
            "status" => ["required", Rule::in(RoomStatusEnum::getValues())],
            "from" => ["required", "datetime"],
            "to" => ["required", "datetime", "after:from"],
        ];
    }

    public function messages(): array
    {
        return [
            "employee_id.required" => "Employee ID wajib diisi.",
            "employee_id.string" => "Employee ID harus berupa string.",
            "employee_id.exists" => "Employee ID tidak ditemukan.",
            "status.required" => "Status wajib diisi.",
            "status.in" => "Status tidak valid.",
            "from.required" => "Tanggal mulai wajib diisi.",
            "from.datetime" => "Tanggal mulai harus berupa tanggal.",
            "to.required" => "Tanggal selesai wajib diisi.",
            "to.datetime" => "Tanggal selesai harus berupa tanggal.",
            "to.after" => "Tanggal selesai harus setelah tanggal mulai.",
        ];
    }
}
