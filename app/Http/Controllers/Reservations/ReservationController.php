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
use App\Models\Guests\Guest;
use App\Models\Reservations\Reservation;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomType;
use App\Models\Managements\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Reservation::orderBy('updated_at', 'desc')->get();

        return Inertia::render("reservation/index", [
            "reservations" => $reservations,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roomTypes = RoomType::all();

        $visitPurposes = VisitPurposeEnum::getValues();
        $bookingTypes = BookingTypeEnum::getValues();
        $roomPackages = RoomPackageEnum::getValues();
        $paymentMethods = PaymentEnum::getValues();
        $genders = GenderEnum::getValues();
        $statusAccs = StatusAccEnum::getValues();

        $employee = Employee::where("user_id", Auth::user()->id)->first();
        $employeeId = $employee->id;

        return Inertia::render("reservation/create", [
            "visitPurposes" => $visitPurposes,
            "bookingTypes" => $bookingTypes,
            "roomPackages" => $roomPackages,
            "roomTypes" => $roomTypes,
            "paymentMethods" => $paymentMethods,
            "genders" => $genders,
            "statusAccs" => $statusAccs,
            "employeeId" => $employeeId,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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

    public function getGuest(string $nik_passport)
    {
        try {
            $guest = Guest::with("user")
                ->where("nik_passport", $nik_passport)
                ->first();

            if (!$guest) {
                return response()->json(
                    [
                        'error' => 'Customer not found'
                    ],
                    404
                );
            }

            return response()->json([
                'customer' => $guest
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Gagal mendapatkan data customer',
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
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function availableRooms(Request $request)
    {
        try {
            $startDate = $request->start;
            $endDate = $request->end;

            if (!$startDate || !$endDate) {
                throw new \Exception('Tanggal tidak valid');
            }

            // Get reserved room IDs that overlap with the given range
            $reservedRoomIds = Reservation::where(function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '<=', $endDate)
                    ->where('end_date', '>=', $startDate);
            })->pluck('room_id');

            // Get rooms that are in available status/condition and not reserved
            $rooms = Room::with('roomStatus')
                ->whereHas('roomStatus', function ($query) {
                    $query->whereIn('status', [
                        RoomStatusEnum::VC,
                        RoomStatusEnum::OO,
                        RoomStatusEnum::CO,
                        RoomStatusEnum::HU,
                    ]);
                })
                ->whereNotIn('condition', [
                    RoomConditionEnum::BOOKED,
                    RoomConditionEnum::BOOKED_CLEANING,
                ])
                ->whereNotIn('id', $reservedRoomIds) // exclude overlapping reservations
                ->get();

            return response()->json([
                "rooms" => $rooms,
            ]);
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
