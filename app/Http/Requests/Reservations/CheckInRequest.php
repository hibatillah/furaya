<?php

namespace App\Http\Requests\Reservations;

use App\Enums\RoomStatusEnum;
use App\Models\Reservations\Reservation;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckInRequest extends FormRequest
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
        return [
            "reservation_id" => [
                "required",
                "string",
                Rule::exists("reservations", "id")
            ],
            "check_in_at" => [
                "required",
                "date",
                function ($attribute, $value, $fail) {
                    $reservation = Reservation::find(request('reservation_id'));

                    if (!$reservation) return;

                    $checkInAt = Carbon::parse($value);
                    $startDateTime = Carbon::parse($reservation->start_date)->setTime(13, 0, 0);
                    $endDateTime = Carbon::parse($reservation->end_date)->setTime(12, 0, 0);

                    // check rules
                    if (
                        $checkInAt->lt($startDateTime) ||
                        $checkInAt->gt($endDateTime)
                    ) {
                        $fail("Check-in tidak dapat dilakukan di luar tanggal dan waktu reservasi.");
                    }
                }
            ],
            "check_in_by" => ["required", "string", "max:255"],
            "employee_id" => [
                "required",
                "string",
                Rule::exists("employees", "id")
            ],
            "notes" => ["nullable", "string", "max:255"],
            "room_status" => ["nullable", "string", Rule::in(RoomStatusEnum::getValues())],
        ];
    }

    public function messages(): array
    {
        return [
            "reservation_id.required" => "Reservation ID wajib diisi.",
            "reservation_id.string" => "Reservation ID harus berupa string.",
            "reservation_id.exists" => "Reservation ID tidak ditemukan.",
            "check_in_at.required" => "Tanggal check-in wajib diisi.",
            "check_in_at.date" => "Tanggal check-in harus berupa tanggal.",
            "check_in_by.required" => "Nama pegawai wajib diisi.",
            "check_in_by.string" => "Nama pegawai harus berupa string.",
            "check_in_by.max" => "Nama pegawai maksimal 255 karakter.",
            "employee_id.required" => "Employee ID wajib diisi.",
            "employee_id.string" => "Employee ID harus berupa string.",
            "employee_id.exists" => "Employee ID tidak ditemukan.",
            "notes.string" => "Catatan harus berupa string.",
            "notes.max" => "Catatan maksimal 255 karakter.",
            "room_status.string" => "Status kamar harus berupa string.",
            "room_status.in" => "Status kamar tidak valid.",
            "room_status.nullable" => "Status kamar opsional.",
        ];
    }
}
