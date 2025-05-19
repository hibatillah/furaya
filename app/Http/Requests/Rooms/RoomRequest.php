<?php

namespace App\Http\Requests\Rooms;

use App\Enums\RoomStatusEnum;
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
            'status' => ['required', Rule::in(RoomStatusEnum::getValues())],
            'room_type_id' => ['required', 'exists:room_types,id'],
            'bed_type_id' => ['required', 'exists:bed_types,id'],
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
            'status.required' => 'Status kamar wajib diisi.',
            'status.in' => 'Status kamar tidak valid.',
            'room_type_id.required' => 'Tipe kamar wajib dipilih.',
            'room_type_id.exists' => 'Tipe kamar yang dipilih tidak ditemukan.',
            'bed_type_id.required' => 'Tipe kasur wajib dipilih.',
            'bed_type_id.exists' => 'Tipe kasur yang dipilih tidak ditemukan.',
        ];
    }
}
