<?php

namespace App\Http\Controllers\Reservations;

use App\Enums\BookingTypeEnum;
use App\Enums\GenderEnum;
use App\Enums\PaymentEnum;
use App\Enums\ReservationStatusEnum;
use App\Enums\ReservationTransactionEnum;
use App\Enums\RoomConditionEnum;
use App\Enums\RoomPackageEnum;
use App\Enums\SmokingTypeEnum;
use App\Enums\StatusAccEnum;
use App\Enums\VisitPurposeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\ReservationRequest;
use App\Models\Guests\Country;
use App\Models\Guests\Guest;
use App\Models\Guests\Nationality;
use App\Models\Reservations\Reservation;
use App\Models\Rooms\RoomType;
use App\Models\Managements\Employee;
use App\Models\Reservations\GuestType;
use App\Models\Rooms\Room;
use App\Models\User;
use App\Services\ReservationService;
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
            $isPending = filter_var(
                $request->input('is_pending'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ) ?? false;

            // get the date range based on the type
            [$start_date, $end_date] = $this->reservationService
                ->getDateRange($type, $start, $end);

            // get the reservations based on the date range
            $query = Reservation::with([
                'reservationRoom' => fn($q) => $q->select([
                    'id',
                    'room_number',
                    'room_type_name',
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
                'status_acc',
                'booking_type',
                'status',
                'smoking_type',
                'include_breakfast',
                'pax',
                'adults',
                'children',
                'total_price',
                'payment_method',
                'transaction_status',
            ]);

            // filter the reservations by date range
            if ($start_date) {
                $query->where('start_date', '>=', $start_date);
            }

            if ($end_date) {
                $query->where('end_date', '<=', $end_date);
            }

            if ($isPending) {
                $query->where('status_acc', StatusAccEnum::PENDING);
            }

            // return the reservations query
            $reservations = $query
                ->orderBy('start_date', 'asc')
                ->latest()
                ->get();

            // get the count of pending reservations
            $countPendingReservation = Reservation::where('status_acc', StatusAccEnum::PENDING)->count();

            // update reservation status
            $this->reservationService->updateOnGoingStatus();

            // get static values
            $status = ReservationStatusEnum::getValues();
            $bookingType = BookingTypeEnum::getValues();
            $roomType = RoomType::all()->pluck('name');
            $statusAcc = StatusAccEnum::getValues();

            return Inertia::render('reservation/index', [
                'reservations' => $reservations,
                'type' => $type,
                'is_pending' => $isPending,
                'count_pending_reservation' => $countPendingReservation,
                'status' => $status,
                'bookingType' => $bookingType,
                'roomType' => $roomType,
                'statusAcc' => $statusAcc,
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menampilkan data reservasi.",
            ]);
        }
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
                "smoking_type",
                "include_breakfast",
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

            $reservationRoom = Arr::only($validated, [
                "room_id",
                "room_number",
                "room_type_id",
                "room_type_name",
                "room_rate",
                "bed_type",
                "view",
            ]);

            $userData = Arr::only($validated, ["name", "email"]);
            $guestData = Arr::only($validated, [
                "nik_passport",
                "phone",
                "gender",
                "birthdate",
                "profession",
                "nationality",
                "address",
            ]);

            $result = DB::transaction(function () use (
                $userData,
                $guestData,
                $reservation,
                $reservationRoom,
                $validated
            ) {
                // upsert user data
                $user = User::updateOrCreate(
                    ['email' => $userData['email']],
                    array_merge($userData, [
                        "password" => Hash::make("123"),
                        "role" => "guest",
                    ])
                );

                $guest = $user->guest()->updateOrCreate(
                    ['phone' => $guestData['phone']],
                    $guestData
                );

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
                $reservation = Reservation::create([
                    ...$reservation,
                    "booking_number" => ReservationService::generateBookingNumber()
                ]);

                $reservation->reservationRoom()->create($reservationRoom);
                $reservation->reservationGuest()->create([
                    ...$reservationGuest,
                    "guest_id" => $guest->id,
                ]);

                // update room related condition
                Room::where('id', $reservationRoom['room_id'])
                    ->update([
                        'condition' => RoomConditionEnum::BOOKED
                    ]);

                // create reservation transaction
                $advanceAmount = $validated["advance_amount"];
                $advanceRemarks = $validated["advance_remarks"];

                $reservation->reservationTransaction()->create([
                    "amount" => $reservation->total_price,
                    "type" => ReservationTransactionEnum::BOOKING,
                    "is_paid" => $advanceAmount > 0,
                    "description" => "Create Booking",
                ]);

                $reservation->reservationTransaction()->create([
                    "amount" => $advanceAmount,
                    "type" => ReservationTransactionEnum::DEPOSIT,
                    "is_paid" => $advanceAmount > 0,
                    "description" => $advanceRemarks ?? "Booking Advance"
                ]);

                return $reservation;
            });

            return redirect()->route("reservation.show", $result->id)
                ->with("success", "Reservasi berhasil ditambahkan");
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            report($e->getMessage());
            return back()->withErrors(["message" => "Terjadi kesalahan menambahkan reservasi."]);
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
            report($e);
            return redirect()->route("reservation.index")->with("error", "Reservasi tidak ditemukan");
        } catch (\Exception $e) {
            report($e);
            return redirect()->route("reservation.index")
                ->with("error", "Terjadi kesalahan menampilkan data reservasi.");
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $dataForm = $this->getDataForm();
            $reservation = Reservation::with(
                "reservationRoom.roomType",
                "reservationRoom.room.bedType",
                "reservationGuest.guest.user",
                "employee.user",
                "checkIn",
                "checkOut"
            )->findOrFail($id);
            $roomTypes = RoomType::all();
            $statusAcc = StatusAccEnum::getValues();

            return Inertia::render("reservation/edit", [
                ...$dataForm,
                "reservation" => $reservation,
                "roomTypes" => $roomTypes,
                "statusAcc" => $statusAcc,
            ]);
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                "message" => "Reservasi tidak ditemukan.",
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                "message" => "Terjadi kesalahan menampilkan data reservasi.",
            ]);
        }
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
                "smoking_type",
                "include_breakfast",
                "employee_name",
                "employee_id",
                "booking_type",
                "visit_purpose",
                "room_package",
                "payment_method",
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
                "room_type_id",
                "room_type_name",
                "room_rate",
                "bed_type",
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
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                "message" => "Reservasi tidak ditemukan.",
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                "message" => "Terjadi kesalahan memperbarui reservasi.",
            ]);
        }
    }

    /**
     * Show the form for confirming the reservation.
     */
    public function reject(string $id)
    {
        try {
            $reservation = Reservation::findOrFail($id);
            $reservation->update([
                "status_acc" => StatusAccEnum::REJECTED,
                "status" => ReservationStatusEnum::CANCELLED,
            ]);

            return back();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                "message" => "Reservasi tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                "message" => "Terjadi kesalahan menolak reservasi",
            ]);
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
            $phone = $request->query("phone");

            // get guest data based on `phone`
            $guest = Guest::with("user")
                ->where("phone", $phone)
                ->first();

            // throw exception if guest not found
            if (!$guest) throw new \Exception("Tamu tidak ditemukan");

            return response()->json([
                'guest' => $guest
            ]);
        } catch (ModelNotFoundException $e) {
            report($e);
            return response()->json(
                [
                    'error' => 'Tamu tidak ditemukan'
                ],
                404
            );
        } catch (\Exception $e) {
            report($e);
            return response()->json(
                [
                    'message' => 'Terjadi kesalahan mendapatkan data tamu',
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

            // get reserved room ids from service
            $reservedRoomIds = $this->reservationService
                ->getReservedRoomIds($startDate, $endDate);

            // get available rooms from service with reservedRoomIds
            $rooms = $this->reservationService
                ->getAvailableRooms($reservedRoomIds, $roomTypeId);

            return response()->json([
                "rooms" => $rooms,
            ]);
        } catch (ModelNotFoundException $e) {
            report($e);
            return response()->json(
                [
                    'error' => 'Kamar tidak ditemukan'
                ],
                404
            );
        } catch (\Exception $e) {
            report($e);
            return response()->json(
                [
                    'message' => 'Terjadi kesalahan mendapatkan data kamar',
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

            // get reserved room ids from service
            $reservedRoomIds = $this->reservationService
                ->getReservedRoomIds($startDate, $endDate);

            // get available room types from service with reservedRoomIds
            $roomTypes = $this->reservationService
                ->getAvailableRoomTypes($reservedRoomIds);

            return response()->json([
                "roomTypes" => $roomTypes,
            ]);
        } catch (ModelNotFoundException $e) {
            report($e);
            return response()->json(
                [
                    'error' => 'Tipe kamar tidak ditemukan'
                ],
                404
            );
        } catch (\Exception $e) {
            report($e);
            return response()->json(
                [
                    'message' => 'Terjadi kesalahan mendapatkan data tipe kamar',
                ],
                500
            );
        }
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
        $smokingTypes = SmokingTypeEnum::getValues();
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
            "smokingTypes" => $smokingTypes,
            "statusAccs" => $statusAccs,
            "employee" => $employee,
        ];
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

            $this->reservationService->updateStatus($id, $status);

            return back();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                "message" => 'Reservasi tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                "message" => "Terjadi kesalahan mengubah status reservasi.",
            ]);
        }
    }
}
