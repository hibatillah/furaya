<?php

namespace App\Http\Requests\Managements;

use App\Enums\GenderEnum;
use App\Models\Managements\Employee;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EmployeeRequest extends FormRequest
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
        $employeeId = Request::route("id"); // null on store, filled on update
        $employee = $employeeId ? Employee::find($employeeId) : null;
        $userId = $employee?->user_id;

        return [
            "department_id" => [
                "required",
                "string",
                Rule::exists("departments", "id"),
            ],
            "gender" => ["required", Rule::in(GenderEnum::getValues())],
            "phone" => [
                "nullable",
                "string",
                Rule::unique("employees", "phone")->ignore($employeeId),
            ],
            "address" => ["nullable", "string", "max:255"],
            "hire_date" => ["required", "date"],
            "salary" => ["nullable", "numeric"],

            // additional
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", "max:255", Rule::unique("users", "email")->ignore($userId)],
            "password" => [
                $employeeId ? "nullable" : "required",
                "string",
                "min:8",
                "max:55",
            ],
        ];
    }

    public function messages(): array
    {
        return [
            "department_id.required" => "Departemen wajib diisi.",
            "department_id.string" => "Departemen harus berupa string.",
            "department_id.exists" => "Departemen tidak ditemukan.",
            "gender.required" => "Jenis kelamin wajib diisi.",
            "gender.in" => "Jenis kelamin tidak valid.",
            "phone.string" => "Nomor telepon harus berupa string.",
            "phone.max" => "Nomor telepon maksimal 55 karakter.",
            "address.string" => "Alamat harus berupa string.",
            "address.max" => "Alamat maksimal 255 karakter.",
            "hire_date.required" => "Tanggal bergabung wajib diisi.",
            "hire_date.date" => "Tanggal bergabung harus berupa tanggal.",
            "salary.numeric" => "Gaji harus berupa angka.",
        ];
    }
}
