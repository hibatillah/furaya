<?php

namespace App\Http\Requests\Roles;

use App\Enums\GenderEnum;
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
        $id = Request::route("id");

        return [
            "user_id" => ["required", "integer", Rule::exists("users", "id")],
            "department_id" => ["required", "string", Rule::exists("departments", "id")],
            "gender" => ["required", Rule::in(GenderEnum::getValues())],
            "phone" => ["nullable", "string", Rule::unique("employees", "phone")->ignore($id)],
            "address" => ["nullable", "string", "max:255"],
            "hire_date" => ["required", "date"],
            "salary" => ["nullable", "numeric"],
        ];
    }

    public function messages(): array
    {
        return [
            "user_id.required" => "User ID wajib diisi.",
            "user_id.string" => "User ID harus berupa string.",
            "user_id.exists" => "User ID tidak ditemukan.",
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
