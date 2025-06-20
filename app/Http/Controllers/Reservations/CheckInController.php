<?php

namespace App\Http\Controllers\Reservations;

use App\Http\Controllers\Controller;
use App\Enums\BookingTypeEnum;
use App\Enums\PaymentEnum;
use App\Enums\ReservationStatusEnum;
use App\Http\Requests\Reservations\CheckInRequest;
use App\Models\Managements\Employee;
use App\Models\Reservations\CheckIn;
use App\Models\Reservations\Reservation;
use App\Models\Rooms\RoomType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckInController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // accept request params for set date range
        $type = $request->input('type', 'upcoming');
        $start = $request->input('start');
        $end = $request->input('end');

        // get the date range based on the type
        $reservationController = new ReservationController();

        [$start_date, $end_date] = $reservationController->getDateRange($type, $start, $end);

        // get the reservations based on the date range
        $query = Reservation::with([
            "checkIn",
            "checkOut",
            'reservationGuest' => fn($q) => $q->select([
                'id',
                'name',
                'reservation_id',
            ]),
        ])->select([
            'id',
            'booking_number',
            'start_date',
            'end_date',
            'booking_type',
            'status',
        ]);

        // filter the reservations by date range
        if ($start_date) {
            $query->where('start_date', '>=', $start_date);
        }

        if ($end_date) {
            $query->where('end_date', '<=', $end_date);
        }

        // return the reservations query
        $reservations = $query
            ->orderBy('start_date', 'asc')
            ->latest()
            ->get();

        // update reservation status
        $reservationController->updateOnGoingReservationStatus();

        // get static values
        $status = ReservationStatusEnum::getValues();
        $bookingType = BookingTypeEnum::getValues();
        $paymentMethod = PaymentEnum::getValues();
        $roomType = RoomType::all()->pluck('name');

        // get current logged in employee user
        $employee = Employee::with('user')
            ->where('user_id', Auth::user()->id)
            ->first();

        return Inertia::render('check-in/index', [
            'reservations' => $reservations,
            'type' => $type,
            'status' => $status,
            'bookingType' => $bookingType,
            'paymentMethod' => $paymentMethod,
            'roomType' => $roomType,
            'employee' => $employee,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CheckInRequest $request)
    {
        try {
            $validated = $request->validated();
            $checkin = Arr::only($validated, [
                'checked_in_at',
                'check_in_by',
                'notes',
                'employee_id',
            ]);

            $reservation = Reservation::findOrFail($validated['reservation_id']);
            $reservation->checkIn()->create($checkin);

            return back();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => "Data reservasi tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => "Gagal menambahkan check-in",
                'message' => $e->getMessage(),
            ]);
        }
    }
}
