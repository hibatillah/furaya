<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;

class FacilityRequest extends FormRequest
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
            "name" => ["required", "string", "max:255", Rule::unique("facilities", "name")->ignore($id)],
            "description" => ["nullable", "string", "max:255"],
        ];
    }

    public function messages(): array
    {
        return [
            "name.required" => "Nama fasilitas wajib diisi.",
            "name.string" => "Nama fasilitas harus berupa string.",
            "name.max" => "Nama fasilitas maksimal 255 karakter.",
            "name.unique" => "Nama fasilitas sudah ada.",
            "description.string" => "Deskripsi harus berupa string.",
            "description.max" => "Deskripsi maksimal 255 karakter.",
        ];
    }
}
