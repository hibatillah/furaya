<?php

namespace App\Http\Controllers\Reservations;

use App\Enums\ReservationTransactionEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\CheckOutRequest;
use App\Models\Reservations\Reservation;
use App\Models\Rooms\Room;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckOutController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(CheckOutRequest $request)
    {
        try {
            $validated = $request->validated();

            $checkout = Arr::only($validated, [
                'check_out_at',
                'check_out_by',
                'additional_charge',
                'notes',
                'employee_id',
            ]);

            DB::transaction(function () use ($validated, $checkout) {
                $reservationId = $validated['reservation_id'];
                $additionalCharge = $validated['additional_charge'];

                // update reservation status
                $reservation = Reservation::findOrFail($reservationId);
                $reservation->checkOut()->create($checkout);

                // update reservation final price
                $reservation->update([
                    'total_price' => $reservation->total_price + $additionalCharge,
                ]);

                if ($additionalCharge > 0) {
                    $reservation->reservationTransaction()->create([
                        "amount" => $additionalCharge,
                        "type" => ReservationTransactionEnum::CHARGE,
                        "is_paid" => true,
                        "description" => "Additional Charge",
                    ]);
                }

                // update related room status
                $room = Room::findOrFail($reservation->reservationRoom->room_id);
                $room->update([
                    'status' => $validated['room_status'],
                ]);
            });

            return back();
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => "Data reservasi tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menambahkan data check-out.",
            ]);
        }
    }
}
