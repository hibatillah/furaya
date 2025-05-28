<?php

namespace App\Http\Requests;

use App\Enums\BookingTypeEnum;
use App\Enums\VisitPurposeEnum;
use App\Enums\RoomPackageEnum;
use App\Enums\PaymentEnum;
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
            "booking_number" => ["required", "integer", Rule::unique("reservations", "booking_number")->ignore($id)],
            "adults" => ["required", "integer"],
            "people_count" => ["required", "integer"],
            "length_of_stay" => ["required", "integer"],
            "check_in" => ["required", "datetime"],
            "check_out" => ["required", "datetime", "after:check_in"],
            "total_price" => ["required", "numeric"],
            "room_id" => ["required", "string", Rule::exists("rooms", "id")],
            "customer_id" => ["required", "string", Rule::exists("customers", "id")],
            "employee_id" => ["required", "string", Rule::exists("employees", "id")],
            "booking_type" => ["required", Rule::in(BookingTypeEnum::getValues())],
            "purpose" => ["required", Rule::in(VisitPurposeEnum::getValues())],
            "room_package" => ["required", Rule::in(RoomPackageEnum::getValues())],
            "payment_method" => ["required", Rule::in(PaymentEnum::getValues())],
            "arrival_from" => ["nullable", "string", "max:255"],
            "booked_from" => ["nullable", "string", "max:255"],
            "children" => ["nullable", "integer"],
            "extra_bed" => ["nullable", "integer"],
            "discount" => ["nullable", "numeric"],
            "discount_reason" => ["nullable", "string", "max:255"],
            "commission_percentage" => ["nullable", "numeric"],
            "commission_amount" => ["nullable", "numeric"],
            "remarks" => ["nullable", "string", "max:255"],
            "advance_remarks" => ["nullable", "string", "max:255"],
            "advance_amount" => ["nullable", "string", "max:255"],
        ];
    }

    public function messages(): array
    {
        return [
            "booking_number.required" => "Booking number wajib diisi.",
            "booking_number.integer" => "Booking number harus berupa angka.",
            "booking_number.unique" => "Booking number sudah ada.",
            "adults.required" => "Jumlah dewasa wajib diisi.",
            "adults.integer" => "Jumlah dewasa harus berupa angka.",
            "people_count.required" => "Jumlah orang wajib diisi.",
            "people_count.integer" => "Jumlah orang harus berupa angka.",
            "length_of_stay.required" => "Lama tinggal wajib diisi.",
            "length_of_stay.integer" => "Lama tinggal harus berupa angka.",
            "check_in.required" => "Tanggal check-in wajib diisi.",
            "check_in.datetime" => "Tanggal check-in harus berupa tanggal.",
            "check_out.required" => "Tanggal check-out wajib diisi.",
            "check_out.datetime" => "Tanggal check-out harus berupa tanggal.",
            "check_out.after" => "Tanggal check-out harus setelah tanggal check-in.",
            "total_price.required" => "Total harga wajib diisi.",
            "total_price.numeric" => "Total harga harus berupa angka.",
            "room_id.required" => "Room ID wajib diisi.",
            "room_id.string" => "Room ID harus berupa string.",
            "room_id.exists" => "Room ID tidak ditemukan.",
            "customer_id.required" => "Customer ID wajib diisi.",
            "customer_id.string" => "Customer ID harus berupa string.",
            "customer_id.exists" => "Customer ID tidak ditemukan.",
            "employee_id.required" => "Employee ID wajib diisi.",
            "employee_id.string" => "Employee ID harus berupa string.",
            "employee_id.exists" => "Employee ID tidak ditemukan.",
            "booking_type.required" => "Tipe booking wajib diisi.",
            "booking_type.in" => "Tipe booking tidak valid.",
            "purpose.required" => "Tujuan wajib diisi.",
            "purpose.in" => "Tujuan tidak valid.",
            "room_package.required" => "Paket kamar wajib diisi.",
            "room_package.in" => "Paket kamar tidak valid.",
            "payment_method.required" => "Metode pembayaran wajib diisi.",
            "payment_method.in" => "Metode pembayaran tidak valid.",
            "arrival_from.string" => "Asal kedatangan harus berupa string.",
            "arrival_from.max" => "Asal kedatangan maksimal 255 karakter.",
            "booked_from.string" => "Tanggal booking harus berupa string.",
            "booked_from.max" => "Tanggal booking maksimal 255 karakter.",
            "children.integer" => "Jumlah anak harus berupa angka.",
            "extra_bed.integer" => "Jumlah kasur ekstra harus berupa angka.",
            "discount.numeric" => "Diskon harus berupa angka.",
            "discount_reason.string" => "Alasan diskon harus berupa string.",
            "discount_reason.max" => "Alasan diskon maksimal 255 karakter.",
            "commission_percentage.numeric" => "Komisi persentase harus berupa angka.",
            "commission_amount.numeric" => "Komisi jumlah harus berupa angka.",
            "remarks.string" => "Keterangan harus berupa string.",
            "remarks.max" => "Keterangan maksimal 255 karakter.",
            "advance_remarks.string" => "Keterangan advanve harus berupa string.",
            "advance_remarks.max" => "Keterangan advanve maksimal 255 karakter.",
            "advance_amount.string" => "Jumlah advanve harus berupa string.",
            "advance_amount.max" => "Jumlah advanve maksimal 255 karakter."
        ];
    }
}
