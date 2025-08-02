<?php

namespace App\Http\Controllers\Reservations;

use App\Http\Controllers\Controller;
use App\Enums\BookingTypeEnum;
use App\Enums\PaymentEnum;
use App\Enums\RoomStatusEnum;
use App\Enums\ReservationStatusEnum;
use App\Http\Requests\Reservations\CheckInRequest;
use App\Models\Managements\Employee;
use App\Models\Reservations\CheckIn;
use App\Models\Reservations\Reservation;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomType;
use App\Services\ReservationService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CheckInController extends Controller
{
    protected ReservationService $reservationService;

    public function __construct(ReservationService $reservation)
    {
        $this->reservationService = $reservation;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // accept request params for set date range
            $type = $request->input('type', 'upcoming');
            $start = $request->input('start');
            $end = $request->input('end');

            // get the date range based on the type
            [$start_date, $end_date] = $this->reservationService
                ->getDateRange($type, $start, $end);

            // get the reservations based on the date range
            $query = Reservation::with([
                "checkIn",
                "checkOut",
                "reservationRoom.room",
                'reservationGuest' => fn($q) => $q->select([
                    'id',
                    'name',
                    'reservation_id',
                ]),
            ])
                ->select([
                    'id',
                    'booking_number',
                    'start_date',
                    'end_date',
                    'status_acc',
                    'total_price',
                    'booking_type',
                    'transaction_status',
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
            $this->reservationService->updateOnGoingStatus();

            // get static values
            $status = ReservationStatusEnum::getValues();
            $roomStatus = RoomStatusEnum::getValues();
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
                'roomStatus' => $roomStatus,
                'bookingType' => $bookingType,
                'paymentMethod' => $paymentMethod,
                'roomType' => $roomType,
                'employee' => $employee,
            ]);
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => "Data reservasi tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            report($e->getMessage());
            return back()->withErrors([
                'message' => "Terjadi kesalahan menampilkan data check-in.",
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CheckInRequest $request)
    {
        try {
            $validated = $request->validated();

            $checkin = Arr::only($validated, [
                'check_in_by',
                'notes',
                'employee_id',
            ]);

            // set timezone
            $checkin['check_in_at'] = Carbon::parse($validated['check_in_at'])
                ->setTimezone('Asia/Jakarta');

            DB::transaction(function () use ($validated, $checkin) {
                // update reservation status
                $reservation = Reservation::findOrFail($validated['reservation_id']);
                $reservation->checkIn()->create($checkin);

                // transaction status set to `settlement` on check-in
                if ($reservation->transaction_status !== "settlement") {
                    $reservation->update([
                        'transaction_status' => "settlement",
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
            report($e->getMessage());
            return back()->withErrors([
                'message' => "Terjadi kesalahan menambahkan data check-in.",
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CheckInRequest $request, string $id)
    {
        try {
            $validated = $request->validated();

            // set check-in timezone
            $validated['check_in_at'] = Carbon::parse($validated['check_in_at'])
                ->setTimezone('Asia/Jakarta');

            // update check-in data
            $existCheckIn = CheckIn::findOrFail($id);
            $existCheckIn->update($validated);

            return back();
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => "Data check-in tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            report($e->getMessage());
            return back()->withErrors([
                'message' => "Terjadi kesalahan mengubah data check-in.",
            ]);
        }
    }
}
