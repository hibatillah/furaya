<?php

namespace App\Http\Requests\Reservations;

use App\Enums\BookingTypeEnum;
use App\Enums\GenderEnum;
use App\Enums\VisitPurposeEnum;
use App\Enums\RoomPackageEnum;
use App\Enums\PaymentEnum;
use App\Enums\StatusAccEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\Rule;

class ReservationRequest extends FormRequest
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
            // reservation data
            "booking_number" => ["required", "integer", Rule::unique("reservations", "booking_number")->ignore($id)],
            "start_date" => ["required", "date"],
            "end_date" => ["required", "date", "after:start_date"],
            "length_of_stay" => ["required", "integer"],
            "adults" => ["required", "integer"],
            "pax" => ["required", "integer"],
            "total_price" => ["required", "numeric"],
            "children" => ["nullable", "integer"],
            "extra_bed" => ["nullable", "integer"],
            "arrival_from" => ["nullable", "string", "max:255"],
            "employee_name" => ["required", "string", "max:255"],
            "employee_id" => ["required", "string", Rule::exists("employees", "id")],
            "booking_type" => ["required", Rule::in(BookingTypeEnum::getValues())],
            "visit_purpose" => ["required", Rule::in(VisitPurposeEnum::getValues())],
            "room_package" => ["required", Rule::in(RoomPackageEnum::getValues())],
            "payment_method" => ["required", Rule::in(PaymentEnum::getValues())],
            "status_acc" => ["required", Rule::in(StatusAccEnum::getValues())],
            "discount" => ["nullable", "numeric"],
            "discount_reason" => ["nullable", "string", "max:255"],
            "commission_percentage" => ["nullable", "numeric"],
            "commission_amount" => ["nullable", "numeric"],
            "remarks" => ["nullable", "string", "max:255"],
            "advance_remarks" => ["nullable", "string", "max:255"],
            "advance_amount" => ["nullable", "numeric"],

            // guest data
            "name" => ["required", "string", "max:255"],
            "email" => ["nullable", "email", "max:255"],
            "nik_passport" => ["required", "string", "max:255"],
            "phone" => ["required", "string", "max:255"],
            "gender" => ["required", Rule::in(GenderEnum::getValues())],
            "birthdate" => ["required", "date"],
            "profession" => ["nullable", "string", "max:255"],
            "nationality" => ["nullable", "string", "max:255"],
            "country" => ["nullable", "string", "max:255"],
            "address" => ["nullable", "string", "max:255"],

            // room data
            "room_id" => ["required", "string", Rule::exists("rooms", "id")],
            "room_number" => ["required", "numeric"],
            "room_type" => ["required", "string", "max:255"],
            "room_rate" => ["required", "numeric"],
            "bed_type" => ["required", "string", "max:255"],
            "meal" => ["nullable", "string", "max:255"],
            "view" => ["nullable", "string", "max:255"],
        ];
    }

    public function messages(): array
    {
        return [
            "booking_number.required" => "Booking number wajib diisi.",
            "booking_number.integer" => "Booking number harus berupa angka.",
            "booking_number.unique" => "Booking number sudah ada.",
            "start_date.required" => "Tanggal check-in wajib diisi.",
            "start_date.date" => "Tanggal check-in harus berupa tanggal.",
            "end_date.required" => "Tanggal check-out wajib diisi.",
            "end_date.date" => "Tanggal check-out harus berupa tanggal.",
            "end_date.after" => "Tanggal check-out harus setelah tanggal check-in.",
            "length_of_stay.required" => "Lama tinggal wajib diisi.",
            "length_of_stay.integer" => "Lama tinggal harus berupa angka.",
            "adults.required" => "Jumlah dewasa wajib diisi.",
            "adults.integer" => "Jumlah dewasa harus berupa angka.",
            "pax.required" => "Jumlah orang wajib diisi.",
            "pax.integer" => "Jumlah orang harus berupa angka.",
            "total_price.required" => "Total harga wajib diisi.",
            "total_price.numeric" => "Total harga harus berupa angka.",
            "children.integer" => "Jumlah anak harus berupa angka.",
            "extra_bed.integer" => "Jumlah kasur ekstra harus berupa angka.",
            "arrival_from.string" => "Asal kedatangan harus berupa string.",
            "arrival_from.max" => "Asal kedatangan maksimal 255 karakter.",
            "employee_name.required" => "Nama karyawan wajib diisi.",
            "employee_name.string" => "Nama karyawan harus berupa string.",
            "employee_name.max" => "Nama karyawan maksimal 255 karakter.",
            "employee_id.required" => "Employee ID wajib diisi.",
            "employee_id.string" => "Employee ID harus berupa string.",
            "employee_id.exists" => "Employee ID tidak ditemukan.",
            "booking_type.required" => "Tipe booking wajib diisi.",
            "booking_type.in" => "Tipe booking tidak valid.",
            "visit_purpose.required" => "Tujuan wajib diisi.",
            "visit_purpose.in" => "Tujuan tidak valid.",
            "room_package.required" => "Paket kamar wajib diisi.",
            "room_package.in" => "Paket kamar tidak valid.",
            "payment_method.required" => "Metode pembayaran wajib diisi.",
            "payment_method.in" => "Metode pembayaran tidak valid.",
            "status_acc.required" => "Status akomodasi wajib diisi.",
            "status_acc.in" => "Status akomodasi tidak valid.",
            "discount.numeric" => "Diskon harus berupa angka.",
            "discount_reason.string" => "Alasan diskon harus berupa string.",
            "discount_reason.max" => "Alasan diskon maksimal 255 karakter.",
            "commission_percentage.numeric" => "Komisi persentase harus berupa angka.",
            "commission_amount.numeric" => "Komisi jumlah harus berupa angka.",
            "remarks.string" => "Keterangan harus berupa string.",
            "remarks.max" => "Keterangan maksimal 255 karakter.",
            "advance_remarks.string" => "Keterangan advanve harus berupa string.",
            "advance_remarks.max" => "Keterangan advanve maksimal 255 karakter.",
            "advance_amount.numeric" => "Jumlah advanve harus berupa angka.",
            "nik_passport.required" => "NIK/Passport wajib diisi.",
            "nik_passport.string" => "NIK/Passport harus berupa string.",
            "nik_passport.max" => "NIK/Passport maksimal 255 karakter.",
            "name.required" => "Nama wajib diisi.",
            "name.string" => "Nama harus berupa string.",
            "name.max" => "Nama maksimal 255 karakter.",
            "phone.required" => "Telepon wajib diisi.",
            "phone.string" => "Telepon harus berupa string.",
            "phone.max" => "Telepon maksimal 255 karakter.",
            "email.email" => "Email tidak valid.",
            "email.max" => "Email maksimal 255 karakter.",
            "gender.required" => "Jenis kelamin wajib diisi.",
            "gender.in" => "Jenis kelamin tidak valid.",
            "birthdate.required" => "Tanggal lahir wajib diisi.",
            "birthdate.date" => "Tanggal lahir harus berupa tanggal.",
            "profession.string" => "Profesi harus berupa string.",
            "profession.max" => "Profesi maksimal 255 karakter.",
            "address.string" => "Alamat harus berupa string.",
            "address.max" => "Alamat maksimal 255 karakter.",
            "nationality.string" => "Kebangsaan harus berupa string.",
            "nationality.max" => "Kebangsaan maksimal 255 karakter.",
            "country.string" => "Negara harus berupa string.",
            "country.max" => "Negara maksimal 255 karakter.",
            "room_id.required" => "Room ID wajib diisi.",
            "room_id.string" => "Room ID harus berupa string.",
            "room_id.exists" => "Room ID tidak ditemukan.",
            "room_number.required" => "Nomor kamar wajib diisi.",
            "room_number.numeric" => "Nomor kamar harus berupa angka.",
            "room_type.required" => "Tipe kamar wajib diisi.",
            "room_type.string" => "Tipe kamar harus berupa string.",
            "room_type.max" => "Tipe kamar maksimal 255 karakter.",
            "room_rate.required" => "Tarif kamar wajib diisi.",
            "room_rate.numeric" => "Tarif kamar harus berupa angka.",
            "bed_type.required" => "Tipe kasur wajib diisi.",
            "bed_type.string" => "Tipe kasur harus berupa string.",
            "bed_type.max" => "Tipe kasur maksimal 255 karakter.",
            "meal.string" => "Penginapan harus berupa string.",
            "meal.max" => "Penginapan maksimal 255 karakter.",
            "view.string" => "Pemandangan harus berupa string.",
            "view.max" => "Pemandangan maksimal 255 karakter."
        ];
    }
}
