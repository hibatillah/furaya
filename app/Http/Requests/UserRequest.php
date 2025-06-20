<?php

namespace App\Http\Requests;

use App\Enums\RoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
            "name" => [
                $this->customRules(),
                "string",
                "max:255"
            ],
            "email" => [
                $this->customRules(),
                "string",
                "email",
                "max:255",
                Rule::unique("users", "email")->ignore($id)
            ],
            "password" => [
                $this->customRules("nullable"),
                "string",
                "min:8"
            ],
            "role" => [
                $this->customRules(),
                Rule::in(RoleEnum::getValues())
            ],
            "email_verified_at" => [
                $this->customRules("nullable"),
                "date"
            ],
        ];
    }

    public function rulesEssential(?int $userId = null): array
    {
        return [
            "name" => [
                $this->customRules(),
                "string",
                "max:255"
            ],
            "email" => [
                $this->customRules(),
                "string",
                "email",
                "max:255",
                Rule::unique("users", "email")->ignore($userId)
            ],
            "password" => [
                $this->customRules("nullable"),
                "string",
                "min:8"
            ],
        ];
    }


    public function messages(): array
    {
        return [
            "name.required" => "Nama wajib diisi.",
            "name.string" => "Nama harus berupa string.",
            "name.max" => "Nama maksimal 255 karakter.",
            "email.required" => "Email wajib diisi.",
            "email.string" => "Email harus berupa string.",
            "email.email" => "Email harus berupa email.",
            "email.max" => "Email maksimal 255 karakter.",
            "email.unique" => "Email sudah digunakan.",
            "password.required" => "Password wajib diisi.",
            "password.string" => "Password harus berupa string.",
            "password.min" => "Password minimal 8 karakter.",
            "role.required" => "Role wajib diisi.",
            "role.in" => "Role tidak valid.",
            "email_verified_at.nullable" => "Email verified at wajib diisi.",
            "email_verified_at.date" => "Email verified at harus berupa tanggal.",
        ];
    }

    private function customRules(?string $defaultRule = "required"): string
    {
        $isPatch = request()->getMethod() === "PATCH";

        return $isPatch ? "sometimes" : $defaultRule;
    }
}
