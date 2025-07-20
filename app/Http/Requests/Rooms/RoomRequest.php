<?php

namespace App\Http\Requests\Rooms;

use App\Enums\RoomConditionEnum;
use App\Enums\RoomStatusEnum;
use App\Enums\SmokingTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;

class RoomRequest extends FormRequest
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
            'room_number' => [
                'required',
                'integer',
                Rule::unique("rooms", 'room_number')->ignore($id)
            ],
            'floor_number' => ['required', 'integer'],
            'view' => ['nullable', 'string', 'max:255'],
            'condition' => [
                'required',
                Rule::in(RoomConditionEnum::getValues())
            ],
            'price' => ['required', 'numeric', 'min:1'],
            'capacity' => ['required', 'integer', 'min:1'],
            "size" => ["nullable", "numeric", "min:0"],
            "smoking_type" => [
                "nullable",
                "string",
                Rule::in(SmokingTypeEnum::getValues())
            ],
            'room_type_id' => ['required', Rule::exists("room_types", "id")],
            'bed_type_id' => ['required', Rule::exists("bed_types", "id")],
            'rate_type_id' => ['required', Rule::exists("rate_types", "id")],
            'status' => ['required', Rule::in(RoomStatusEnum::getLabels())],
            'facilities' => ['nullable', 'array'],
            'facilities.*' => ['nullable', 'string', Rule::exists("facilities", "id")],
            'images' => ['nullable', 'array'],
            'images.*' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,webp',
                'max:5120'
            ],
            'room_layout' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,webp',
                'max:5120'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'room_number.required' => 'Nomor kamar wajib diisi.',
            'room_number.integer' => 'Nomor kamar harus berupa angka.',
            'room_number.unique' => 'Nomor kamar sudah digunakan.',
            'floor_number.required' => 'Nomor lantai wajib diisi.',
            'floor_number.integer' => 'Nomor lantai harus berupa angka.',
            'view.string' => 'View harus berupa string.',
            'view.max' => 'View maksimal 255 karakter.',
            'condition.required' => 'Kondisi kamar wajib diisi.',
            'condition.in' => 'Kondisi kamar tidak valid.',
            'price.required' => 'Harga kamar wajib diisi.',
            'price.numeric' => 'Harga kamar harus berupa angka.',
            'price.min' => 'Harga kamar minimal 1.',
            'capacity.required' => 'Kapasitas kamar wajib diisi.',
            'capacity.integer' => 'Kapasitas kamar harus berupa angka.',
            'capacity.min' => 'Kapasitas kamar minimal 1.',
            'room_type_id.required' => 'Tipe kamar wajib dipilih.',
            'room_type_id.exists' => 'Tipe kamar yang dipilih tidak ditemukan.',
            'bed_type_id.required' => 'Tipe kasur wajib dipilih.',
            'bed_type_id.exists' => 'Tipe kasur yang dipilih tidak ditemukan.',
            'rate_type_id.required' => 'Tipe tarif wajib dipilih.',
            'rate_type_id.exists' => 'Tipe tarif yang dipilih tidak ditemukan.',
            'status.required' => 'Status kamar wajib dipilih.',
            'status.in' => 'Status kamar yang dipilih tidak valid.',
            'facilities.array' => 'Fasilitas kamar harus berupa array.',
            'facilities.*.string' => 'Fasilitas kamar harus berupa string.',
            'facilities.*.exists' => 'Fasilitas kamar tidak ditemukan.',
            'images.array' => 'Gambar kamar harus berupa array.',
            'images.*.image' => 'Gambar kamar harus berupa gambar.',
            'images.*.max' => 'Gambar kamar maksimal 5MB.',
            'room_layout.image' => 'Denah kamar harus berupa gambar.',
            'room_layout.mimes' => 'Denah kamar harus berupa gambar.',
            'room_layout.max' => 'Denah kamar maksimal 5MB.',
        ];
    }
}
