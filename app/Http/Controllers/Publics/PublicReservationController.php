<?php

namespace App\Http\Controllers\Publics;

use App\Http\Controllers\Controller;
use App\Services\ReservationService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicReservationController extends Controller
{
    protected ReservationService $reservationService;

    public function __construct(ReservationService $reservation)
    {
        $this->reservationService = $reservation;
    }

    public function index(Request $request)
    {
        try {
            // get url request
            $startDate = $request->input('start_date', now());
            $endDate = $request->input('end_date', now()->addDays(1));
            $adults = $request->input('adults', 1);
            $children = $request->input('children', 0);

            if (!$startDate || !$endDate) {
                throw new \Exception('Tanggal tidak valid');
            }

            // get reserved room ids from service
            $reservedRoomIds = $this->reservationService
                ->getReservedRoomIds($startDate, $endDate);

            // get available roreservedRoomIds
            $roomTypes = $this->reservationService
                ->getAvailableRoomTypes($reservedRoomIds);

            return Inertia::render("public/reservation/index", [
                "roomTypes" => $roomTypes,
                "startDate" => $startDate,
                "endDate" => $endDate,
                "adults" => $adults,
                "children" => $children,
            ]);
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                "message" => "Data tidak ditemukan.",
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                "message" => "Terjadi kesalahan menampilkan data reservasi.",
            ]);
        }
    }

    public function room() {}
}
