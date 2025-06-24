<?php

namespace App\Http\Controllers\Reservations;

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
                'checked_out_at',
                'check_out_by',
                'final_total',
                'notes',
                'employee_id',
            ]);

            DB::transaction(function () use ($validated, $checkout) {
                // update reservation status
                $reservation = Reservation::findOrFail($validated['reservation_id']);
                $reservation->checkOut()->create($checkout);

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
