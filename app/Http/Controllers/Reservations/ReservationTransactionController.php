<?php

namespace App\Http\Controllers\Reservations;

use App\Http\Controllers\Controller;
use App\Models\Reservations\Reservation;
use Inertia\Inertia;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ReservationTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $id)
    {
        try {
            $reservation = Reservation::with([
                'reservationGuest:id,reservation_id,name',
                'reservationRoom:id,reservation_id,room_number',
                'reservationTransaction' => fn($q) => $q->orderBy('created_at')->select([
                    'id',
                    'reservation_id',
                    'amount',
                    'description',
                    'created_at',
                ]),
            ])
                ->select([
                    'id',
                    'booking_number',
                    'start_date',
                    'end_date',
                    'length_of_stay',
                    'booking_type',
                    'payment_method',
                    'total_price',
                    'status',
                ])
                ->findOrFail($id);

            return Inertia::render("reservation/transaction", [
                "reservation" => $reservation,
            ]);
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Reservasi tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menampilkan data transaksi reservasi.",
            ]);
        }
    }
}
