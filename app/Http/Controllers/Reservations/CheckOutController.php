<?php

namespace App\Http\Controllers\Reservations;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\CheckOutRequest;
use App\Models\Reservations\Reservation;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

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

            $reservation = Reservation::findOrFail($validated['reservation_id']);
            $reservation->checkOut()->create($checkout);

            return back();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => "Data reservasi tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => "Gagal menambahkan check-out",
                'message' => $e->getMessage(),
            ]);
        }
    }
}
