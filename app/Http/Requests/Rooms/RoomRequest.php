<?php

namespace App\Http\Requests\Rooms;

use App\Enums\RoomConditionEnum;
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
            'condition' => ['required', Rule::in(RoomConditionEnum::getValues())],
            'price' => ['required', 'numeric', 'min:1'],
            'capacity' => ['required', 'integer', 'min:1'],
            'room_type_id' => ['required', Rule::exists("room_types", "id")],
            'bed_type_id' => ['required', Rule::exists("bed_types", "id")],
            'room_status_id' => ['nullable', Rule::exists("room_status", "id")],
            'facilities' => ['nullable', 'array'],
            'facilities.*' => ['nullable', 'string', Rule::exists("facilities", "id")],
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
            'room_type_id.exist' => 'Tipe kamar yang dipilih tidak ditemukan.',
            'bed_type_id.required' => 'Tipe kasur wajib dipilih.',
            'bed_type_id.exist' => 'Tipe kasur yang dipilih tidak ditemukan.',
            'room_status_id.required' => 'Status kamar wajib dipilih.',
            'room_status_id.exist' => 'Status kamar yang dipilih tidak ditemukan.',
        ];
    }
}
