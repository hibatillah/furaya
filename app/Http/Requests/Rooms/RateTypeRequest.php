<?php

namespace App\Http\Requests\Rooms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;

class RateTypeRequest extends FormRequest
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
        $id = Request::route('id');

        return [
            "code" => ["required", "string", "max:5", Rule::unique("rate_types", "code")->ignore($id)],
            "name" => ["required", "string", "max:255", Rule::unique("rate_types", "name")->ignore($id)],
            "rate" => ["required", "numeric", "min:0", "max:99999999.99"],
        ];
    }

    public function messages(): array
    {
        return [
            "code.required" => "Kode wajib diisi.",
            "code.string" => "Kode harus berupa string.",
            "code.max" => "Kode maksimal 5 karakter.",
            "code.unique" => "Kode sudah ada.",
            "name.required" => "Nama wajib diisi.",
            "name.string" => "Nama harus berupa string.",
            "name.max" => "Nama maksimal 255 karakter.",
            "name.unique" => "Nama sudah ada.",
            "rate.required" => "Tarif wajib diisi.",
            "rate.numeric" => "Tarif harus berupa angka.",
            "rate.min" => "Tarif minimal 0.",
            "rate.max" => "Tarif maksimal 99999999.99.",
        ];
    }
}
