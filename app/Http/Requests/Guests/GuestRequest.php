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
            "nik_passport" => ["required", "string", "max:55", Rule::unique("guests", "nik_passport")->ignore($id)],
            "gender" => ["required", Rule::in(GenderEnum::getValues())],
            "birthdate" => ["required", "date"],
            "phone" => ["nullable", "string", "max:55"],
            "profession" => ["nullable", "string", "max:255"],
            "nationality" => ["nullable", "string", "max:255"],
            "address" => ["nullable", "string", "max:255"],

            // additional
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", "max:255", Rule::exists("users", "email")],
        ];
    }

    public function messages(): array
    {
        return [
            "user_id.required" => "User ID wajib diisi.",
            "user_id.string" => "User ID harus berupa string.",
            "user_id.exist" => "User ID tidak ditemukan.",
            "nik_passport.required" => "NIK/Passport wajib diisi.",
            "nik_passport.string" => "NIK/Passport harus berupa string.",
            "nik_passport.max" => "NIK/Passport maksimal 55 karakter.",
            "gender.required" => "Jenis kelamin wajib diisi.",
            "gender.in" => "Jenis kelamin tidak valid.",
            "birthdate.required" => "Tanggal lahir wajib diisi.",
            "birthdate.date" => "Tanggal lahir harus berupa tanggal.",
            "phone.string" => "Nomor telepon harus berupa string.",
            "phone.max" => "Nomor telepon maksimal 55 karakter.",
            "profession.string" => "Profesi harus berupa string.",
            "profession.max" => "Profesi maksimal 255 karakter.",
            "nationality.string" => "Kewarganegaraan harus berupa string.",
            "nationality.max" => "Kewarganegaraan maksimal 255 karakter.",
            "address.string" => "Alamat harus berupa string.",
            "address.max" => "Alamat maksimal 255 karakter.",

            // additional
            "name.required" => "Nama pengguna wajib diisi.",
            "name.string" => "Nama pengguna harus berupa string.",
            "name.max" => "Nama pengguna maksimal 255 karakter.",
            "email.required" => "Email pengguna wajib diisi.",
            "email.email" => "Email pengguna harus berupa email.",
            "email.max" => "Email pengguna maksimal 255 karakter.",
            "email.exists" => "Email pengguna tidak ditemukan.",
        ];
    }
}
