<?php

namespace App\Http\Controllers\Reservations;

use App\Enums\BookingTypeEnum;
use App\Enums\GenderEnum;
use App\Enums\PaymentEnum;
use App\Enums\RoomConditionEnum;
use App\Enums\RoomPackageEnum;
use App\Enums\RoomStatusEnum;
use App\Enums\StatusAccEnum;
use App\Enums\VisitPurposeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\ReservationRequest;
use App\Models\Guests\Country;
use App\Models\Guests\Guest;
use App\Models\Guests\Nationality;
use App\Models\Reservations\Reservation;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomType;
use App\Models\Managements\Employee;
use App\Models\Reservations\GuestType;
use App\Models\Reservations\ReservationRoom;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $type = $request->input('type', 'upcoming');
        $start = $request->input('start');
        $end = $request->input('end');

        // get the date range
        [$start_date, $end_date] = $this->getDateRange($type, $start, $end);

        // get the reservations
        $query = Reservation::with([
            'reservationRoom' => fn($q) => $q->select([
                'id',
                'room_number',
                'room_type',
                'reservation_id',
            ]),
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
            'payment_method',
        ]);

        // filter the reservations by date range
        if ($start_date) {
            $query->where('start_date', '>=', $start_date);
        }

        if ($end_date) {
            $query->where('end_date', '<=', $end_date);
        }

        // return the reservations
        $reservations = $query->latest()->get();

        return Inertia::render('reservation/index', [
            'reservations' => $reservations,
            'type' => $type,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roomTypes = RoomType::all();
        $guestTypes = GuestType::all();
        $nationalities = Nationality::all();
        $countries = Country::all();

        $visitPurposes = VisitPurposeEnum::getValues();
        $bookingTypes = BookingTypeEnum::getValues();
        $roomPackages = RoomPackageEnum::getValues();
        $paymentMethods = PaymentEnum::getValues();
        $genders = GenderEnum::getValues();
        $statusAccs = StatusAccEnum::getValues();

        $employee = Employee::with("user")
            ->where("user_id", Auth::user()->id)
            ->first();

        return Inertia::render("reservation/create", [
            "roomTypes" => $roomTypes,
            "guestTypes" => $guestTypes,
            "nationalities" => $nationalities,
            "countries" => $countries,
            "visitPurposes" => $visitPurposes,
            "bookingTypes" => $bookingTypes,
            "roomPackages" => $roomPackages,
            "paymentMethods" => $paymentMethods,
            "genders" => $genders,
            "statusAccs" => $statusAccs,
            "employee" => $employee,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ReservationRequest $request)
    {
        try {
            $validated = $request->validated();

            // ---DEFINE DATA---
            // define reservation data
            $reservation = Arr::only($validated, [
                "booking_number",
                "start_date",
                "end_date",
                "length_of_stay",
                "adults",
                "pax",
                "total_price",
                "children",
                "arrival_from",
                "guest_type",
                "employee_name",
                "employee_id",
                "booking_type",
                "visit_purpose",
                "room_package",
                "payment_method",
                "status_acc",
                "discount",
                "discount_reason",
                "commission_percentage",
                "commission_amount",
                "remarks",
                "advance_remarks",
                "advance_amount",
            ]);

            // define reservation room data
            $reservationRoom = Arr::only($validated, [
                "room_id",
                "room_number",
                "room_type",
                "room_rate",
                "bed_type",
                "meal",
                "view",
            ]);

            // define user guest data
            $userData = Arr::only($validated, [
                "name",
                "email",
            ]);
            $guestData = Arr::only($validated, [
                "nik_passport",
                "phone",
                "gender",
                "birthdate",
                "profession",
                "nationality",
                "address",
            ]);

            // ---CREATE RESERVATION DATA---
            DB::transaction(function () use (
                $userData,
                $guestData,
                $reservation,
                $reservationRoom,
                $validated
            ) {
                // upsert user data based on `email`
                $user = User::updateOrCreate(
                    ['email' => $userData['email']],
                    array_merge($userData, [
                        "password" => Hash::make("haihaihai"),
                        "role" => "guest",
                    ])
                );

                // upsert guest data based on `nik_passport`
                $guest = $user->guest()->updateOrCreate(
                    ['nik_passport' => $guestData['nik_passport']],
                    $guestData
                );

                // define reservation guest data
                $reservationGuest = $guest->only([
                    "nik_passport",
                    "name",
                    "phone",
                    "email",
                    "address",
                    "nationality",
                ]);
                $reservationGuest["country"] = $validated["country"];

                // create reservation
                $reservation = Reservation::create($reservation);
                $reservation->reservationRoom()->create($reservationRoom);
                $reservation->reservationGuest()->create($reservationGuest);
                $reservation->reservationTransaction()->create([
                    "amount" => $validated["total_price"],
                    "description" => "Create Booking",
                ]);
                $reservation->reservationTransaction()->create([
                    "amount" => $validated["advance_amount"],
                    "description" => $validated["advance_remarks"] || "Add Booking Advance",
                ]);
            });

            return redirect()->route("reservation.index")
                ->with("success", "Reservasi berhasil ditambahkan");
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $reservation = Reservation::with(
                "reservationRoom.room.roomType",
                "reservationRoom.room.bedType",
                "reservationRoom.room.meal",
                "reservationGuest.guest.user",
                "employee.user",
                "checkIn.employee.user",
                "checkOut.employee.user"
            )
                ->findOrFail($id);

            return Inertia::render("reservation/show", [
                "reservation" => $reservation,
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->route("reservation.index")->with("error", "Reservasi tidak ditemukan");
        } catch (\Exception $e) {
            return redirect()->route("reservation.index")
                ->with("error", $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Get the date range based on the type
     *
     * @param string $type
     * @param string|null $start
     * @param string|null $end
     * @return array [start_date, end_date]
     */
    private function getDateRange(
        string $type,
        ?string $start,
        ?string $end
    ): array {
        $today = Carbon::today();

        switch ($type) {
            case 'last_30_days':
                return [$today->copy()->subDays(30)->startOfDay(), $today->copy()->endOfDay()];

            case 'last_3_months':
                return [$today->copy()->subMonths(3)->startOfDay(), $today->copy()->endOfDay()];

            case 'last_6_months':
                return [$today->copy()->subMonths(6)->startOfDay(), $today->copy()->endOfDay()];

            case 'last_year':
                return [$today->copy()->subYear()->startOfDay(), $today->copy()->endOfDay()];

            case 'custom_range':
                $start_date = $start
                    ? Carbon::parse($start)->startOfDay()
                    : null;
                $end_date = $end
                    ? Carbon::parse($end)->endOfDay()
                    : Carbon::today()->endOfDay();

                return [$start_date, $end_date];

            case 'upcoming':
            default:
                return [$today->copy()->startOfDay(), null];
        }
    }

    /**
     * Get the guest data
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getGuest(Request $request)
    {
        try {
            $nik_passport = $request->query("nik_passport");

            $guest = Guest::with("user")
                ->where("nik_passport", $nik_passport) // search by nik or passport
                ->first();

            // throw exception if guest not found
            if (!$guest) throw new \Exception("Tamu tidak ditemukan");

            return response()->json([
                'guest' => $guest
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(
                [
                    'error' => 'Tamu tidak ditemukan'
                ],
                404
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Gagal mendapatkan data tamu',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Get available rooms
     * based on room status and condition
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAvailableRooms(Request $request)
    {
        try {
            $startDate = $request->start;
            $endDate = $request->end;
            $roomTypeId = $request->room_type_id;

            if (!$startDate || !$endDate) {
                throw new \Exception('Tanggal tidak valid');
            }

            // Get reserved room IDs that overlap with the given range
            $reservedRoomIds = Reservation::where(function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '<=', $endDate)
                    ->where('end_date', '>=', $startDate);
            })
                ->whereHas('reservationRoom')
                ->pluck('id')
                ->map(function ($reservationId) {
                    return ReservationRoom::where('reservation_id', $reservationId)->pluck('room_id');
                })
                ->flatten();

            // Get rooms that are in available status/condition and not reserved
            $rooms = Room::with(['roomType', 'bedType', 'meal'])
                ->whereIn('status', [
                    RoomStatusEnum::VC,
                    RoomStatusEnum::OO,
                    RoomStatusEnum::CO,
                    RoomStatusEnum::HU,
                ])
                ->whereNotIn('condition', [
                    RoomConditionEnum::BOOKED,
                    RoomConditionEnum::BOOKED_CLEANING,
                ])
                ->whereNotIn('id', $reservedRoomIds) // exclude overlapping reservations
                ->when($roomTypeId, function ($query) use ($roomTypeId) {
                    $query->where('room_type_id', $roomTypeId);
                })
                ->get();

            return response()->json([
                "rooms" => $rooms,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(
                [
                    'error' => 'Kamar tidak ditemukan'
                ],
                404
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Gagal mendapatkan data kamar',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }
}
