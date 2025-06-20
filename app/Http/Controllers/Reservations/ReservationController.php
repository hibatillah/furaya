<?php

namespace App\Http\Controllers\Reservations;

use App\Enums\BookingTypeEnum;
use App\Enums\GenderEnum;
use App\Enums\PaymentEnum;
use App\Enums\ReservationStatusEnum;
use App\Enums\ReservationTransactionEnum;
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
use App\Models\Reservations\ReservationTransaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ReservationController extends Controller
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
        [$start_date, $end_date] = $this->getDateRange($type, $start, $end);

        // get the reservations based on the date range
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
        $this->updateOnGoingReservationStatus();

        // get static values
        $status = ReservationStatusEnum::getValues();
        $bookingType = BookingTypeEnum::getValues();
        $paymentMethod = PaymentEnum::getValues();
        $roomType = RoomType::all()->pluck('name');

        return Inertia::render('reservation/index', [
            'reservations' => $reservations,
            'type' => $type,
            'status' => $status,
            'bookingType' => $bookingType,
            'paymentMethod' => $paymentMethod,
            'roomType' => $roomType,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $dataForm = $this->getDataForm();

        return Inertia::render("reservation/create", $dataForm);
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
                $reservation = Reservation::create(array_merge(
                    $reservation,
                    [
                        "booking_number" => Reservation::generateBookingNumber(),
                    ]
                ));
                $reservation->reservationRoom()->create($reservationRoom);
                $reservation->reservationGuest()->create($reservationGuest);
                $reservation->reservationTransaction()->create([
                    "amount" => $validated["total_price"],
                    "type" => ReservationTransactionEnum::BOOKING,
                    "is_paid" => $validated["advance_amount"] > 0,
                    "description" => "Create Booking",
                ]);
                $reservation->reservationTransaction()->create([
                    "amount" => $validated["advance_amount"],
                    "type" => ReservationTransactionEnum::DEPOSIT,
                    "is_paid" => $validated["advance_amount"] > 0,
                    "description" => $validated["advance_remarks"] || "Add Booking Advance",
                ]);
            });

            return redirect()->route("reservation.index")
                ->with("success", "Reservasi berhasil ditambahkan");
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => "Terjadi kesalahan menambahkan reservasi.",
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        try {
            $status = ReservationStatusEnum::getValues();

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
                "status" => $status,
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
        $dataForm = $this->getDataForm();
        $reservation = Reservation::with(
            "reservationRoom.room.roomType",
            "reservationRoom.room.bedType",
            "reservationRoom.room.meal",
            "reservationGuest.guest.user",
            "employee.user",
        )->findOrFail($id);

        return Inertia::render("reservation/edit", [
            ...$dataForm,
            "reservation" => $reservation,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ReservationRequest $request, string $id)
    {
        try {
            $validated = $request->validated();

            // Find the existing reservation
            $existingReservation = Reservation::findOrFail($id);

            // ---DEFINE DATA---
            // define reservation data
            $reservation = Arr::only($validated, [
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

            // ---UPDATE RESERVATION DATA---
            DB::transaction(function () use (
                $existingReservation,
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

                // update reservation
                $existingReservation->update($reservation);

                // update reservation room
                $existingReservation->reservationRoom()->update($reservationRoom);

                // update reservation guest
                $existingReservation->reservationGuest()->update($reservationGuest);

                // Update or create booking transaction if it doesn't exist
                $bookingTransaction = $existingReservation->reservationTransaction()
                    ->where('type', ReservationTransactionEnum::BOOKING)
                    ->first();

                if ($bookingTransaction) {
                    $bookingTransaction->update([
                        "amount" => $validated["total_price"],
                        "is_paid" => $validated["advance_amount"] > 0,
                    ]);
                } else {
                    $existingReservation->reservationTransaction()->create([
                        "amount" => $validated["total_price"],
                        "type" => ReservationTransactionEnum::BOOKING,
                        "is_paid" => $validated["advance_amount"] > 0,
                        "description" => "Create Booking",
                    ]);
                }

                // Update or create deposit transaction if advance amount exists
                if ($validated["advance_amount"] > 0) {
                    $depositTransaction = $existingReservation->reservationTransaction()
                        ->where('type', ReservationTransactionEnum::DEPOSIT)
                        ->first();

                    if ($depositTransaction) {
                        $depositTransaction->update([
                            "amount" => $validated["advance_amount"],
                            "is_paid" => true,
                            "description" => $validated["advance_remarks"] || "Add Booking Advance",
                        ]);
                    } else {
                        $existingReservation->reservationTransaction()->create([
                            "amount" => $validated["advance_amount"],
                            "type" => ReservationTransactionEnum::DEPOSIT,
                            "is_paid" => true,
                            "description" => $validated["advance_remarks"] || "Add Booking Advance",
                        ]);
                    }
                }
            });

            return redirect()->route("reservation.show", $id)
                ->with("success", "Reservasi berhasil diperbarui");
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                "message" => "Reservasi tidak ditemukan.",
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    /**
     * Get the date range based on the type
     *
     * @param string $type
     * @param string|null $start
     * @param string|null $end
     * @return array [start_date, end_date]
     */
    public function getDateRange(
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

            // get guest data based on nik_passport
            $guest = Guest::with("user")
                ->where("nik_passport", $nik_passport)
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
     * based on reservation date, room status and condition
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

            // Get room IDs from reservation rooms that belong to overlapping reservations
            $reservedRoomIds = $this->getReservedRoomIds($startDate, $endDate);

            // Get rooms that are in available status/condition and not reserved
            $rooms = Room::with('roomType', 'bedType', 'meal')
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
                ->where('room_type_id', $roomTypeId)
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

    /**
     * Get available room types
     * based on reservation date, room status and condition
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAvailableRoomTypes(Request $request)
    {
        try {
            $startDate = $request->start;
            $endDate = $request->end;

            if (!$startDate || !$endDate) {
                throw new \Exception('Tanggal tidak valid');
            }

            // Get room IDs from reservation rooms that belong to overlapping reservations
            $reservedRoomIds = $this->getReservedRoomIds($startDate, $endDate);

            // Get room types that have available rooms
            $roomTypes = RoomType::whereHas('room', function ($query) use ($reservedRoomIds) {
                $query->whereIn('status', [
                    RoomStatusEnum::VC,
                    RoomStatusEnum::OO,
                    RoomStatusEnum::CO,
                    RoomStatusEnum::HU,
                ])
                    ->whereNotIn('condition', [
                        RoomConditionEnum::BOOKED,
                        RoomConditionEnum::BOOKED_CLEANING,
                    ])
                    ->whereNotIn('id', $reservedRoomIds);
            })
                ->get();

            return response()->json([
                "roomTypes" => $roomTypes,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(
                [
                    'error' => 'Tipe kamar tidak ditemukan'
                ],
                404
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Gagal mendapatkan data tipe kamar',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Get roomIDs that are reserved
     * based on reservation date
     *
     * @param string $startDate
     * @param string $endDate
     * @return \Illuminate\Support\Collection
     */
    private function getReservedRoomIds($startDate, $endDate)
    {
        $reservedRoomIds = ReservationRoom::whereHas('reservation', function ($query) use ($startDate, $endDate) {
            $query->where('start_date', '<=', $endDate)
                ->where('end_date', '>=', $startDate);
        })->pluck('room_id');

        return $reservedRoomIds;
    }


    /**
     * Get data needed for reservation form
     */
    private function getDataForm()
    {
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

        return [
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
        ];
    }

    /**
     * Update reservation status automatically
     */
    public function updateOnGoingReservationStatus()
    {
        $reservations = Reservation::whereNotIn("status", [
            ReservationStatusEnum::CHECKED_OUT,
            ReservationStatusEnum::NO_SHOW,
            ReservationStatusEnum::CANCELLED,
            ReservationStatusEnum::OVERDUE,
        ])->get();

        if (!$reservations->isEmpty()) {
            foreach ($reservations as $reservation) {
                $reservation->updateReservationStatus();
            }
        }
    }

    /**
     * Update reservation status manually
     */
    public function updateStatus(Request $request, string $id)
    {
        try {
            $status = $request->input("status");

            if (!$status) {
                throw new \Exception("Status tidak valid");
            }

            $reservation = Reservation::findOrFail($id);
            $reservation->update([
                "status" => $status,
            ]);

            return back();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                "message" => 'Reservasi tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }
}
