<?php

namespace App\Http\Requests\Guests;

use App\Enums\GenderEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;

class GuestRequest extends FormRequest
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
            "user_id" => ["required", "integer", "exists:users,id"],
            "phone" => ["required", "string", "max:55"],
            "nik_passport" => [
                "nullable",
                "string",
                "max:55",
                Rule::unique("guests", "nik_passport")->ignore($id)
            ],
            "gender" => ["nullable", Rule::in(GenderEnum::getValues())],
            "birthdate" => ["nullable", "date"],
            "profession" => ["nullable", "string", "max:255"],
            "nationality" => ["nullable", "string", "max:255"],
            "nationality_code" => ["nullable", "string", "max:5"],
            "country" => ["nullable", "string", "max:255"],
            "country_code" => ["nullable", "string", "max:5"],
            "address" => ["nullable", "string", "max:255"],

            // user data
            "name" => ["nullable", "string", "max:255"],
            "email" => ["nullable", "email", "max:255", Rule::exists("users", "email")],
        ];
    }

    public function messages(): array
    {
        return [
            "user_id.required" => "User ID wajib diisi.",
            "user_id.string" => "User ID harus berupa string.",
            "user_id.exist" => "User ID tidak ditemukan.",
            "nik_passport.string" => "NIK/Passport harus berupa string.",
            "nik_passport.max" => "NIK/Passport maksimal 55 karakter.",
            "gender.in" => "Jenis kelamin tidak valid.",
            "birthdate.date" => "Tanggal lahir harus berupa tanggal.",
            "phone.string" => "Nomor telepon harus berupa string.",
            "phone.max" => "Nomor telepon maksimal 55 karakter.",
            "profession.string" => "Profesi harus berupa string.",
            "profession.max" => "Profesi maksimal 255 karakter.",
            "nationality.string" => "Kewarganegaraan harus berupa string.",
            "nationality.max" => "Kewarganegaraan maksimal 255 karakter.",
            "nationality_code.string" => "Kode kebangsaan harus berupa string.",
            "nationality_code.max" => "Kode kebangsaan maksimal 5 karakter.",
            "country.string" => "Negara harus berupa string.",
            "country.max" => "Negara maksimal 255 karakter.",
            "country_code.string" => "Kode negara harus berupa string.",
            "country_code.max" => "Kode negara maksimal 5 karakter.",
            "address.string" => "Alamat harus berupa string.",
            "address.max" => "Alamat maksimal 255 karakter.",

            // user data
            "name.string" => "Nama pengguna harus berupa string.",
            "name.max" => "Nama pengguna maksimal 255 karakter.",
            "email.email" => "Email pengguna harus berupa email.",
            "email.max" => "Email pengguna maksimal 255 karakter.",
            "email.exists" => "Email pengguna tidak ditemukan.",
        ];
    }
}
