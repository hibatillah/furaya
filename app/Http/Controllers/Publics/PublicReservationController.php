<?php

namespace App\Http\Controllers\Publics;

use App\Enums\GenderEnum;
use App\Enums\ReservationStatusEnum;
use App\Enums\ReservationTransactionEnum;
use App\Enums\SmokingTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\ReservationRequest;
use App\Models\Guests\Country;
use App\Models\Guests\Guest;
use App\Models\Guests\Nationality;
use App\Models\Reservations\Reservation;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomType;
use App\Models\User;
use App\Services\ReservationService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
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
            $promoCode = $request->input('promo_code', '');

            if (!$startDate || !$endDate) {
                throw new \Exception('Tanggal tidak valid');
            }

            // get reserved room ids from service
            $reservedRoomIds = $this->reservationService
                ->getReservedRoomIds($startDate, $endDate);

            // get available room types based on reserved room ids
            $roomTypes = $this->reservationService
                ->getAvailableRoomTypes($reservedRoomIds);

            return Inertia::render("public/reservation/index", [
                "roomTypes" => $roomTypes,
                "startDate" => $startDate,
                "endDate" => $endDate,
                "adults" => $adults,
                "children" => $children,
                "promoCode" => $promoCode,
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

    public function create(Request $request)
    {
        try {
            // get url request
            $roomTypeId = $request->input('room_type_id');
            $startDate = $request->input('start_date', now());
            $endDate = $request->input('end_date', now()->addDays(1));
            $adults = $request->input('adults', 1);
            $children = $request->input('children', 0);
            $promoCode = $request->input('promo_code', '');

            $lengthOfStay = Carbon::parse($startDate)
                ->diffInDays(Carbon::parse($endDate));

            if (!$roomTypeId) {
                throw new \Exception('Kamar tidak ditemukan');
            }

            $roomType = RoomType::with(
                "bedType",
                "facility",
                "rateType",
            )
                ->findOrFail($roomTypeId);

            // get static data
            $genders = GenderEnum::getValues();
            $smokingTypes = SmokingTypeEnum::getValues();
            $nationalities = Nationality::all();
            $countries = Country::all();

            // get user data
            $user = Auth::user();
            $guest = $user?->guest;

            return Inertia::render("public/reservation/create", [
                "roomType" => $roomType,
                "genders" => $genders,
                "nationalities" => $nationalities,
                "countries" => $countries,
                "smokingTypes" => $smokingTypes,
                "startDate" => $startDate,
                "endDate" => $endDate,
                "adults" => $adults,
                "children" => $children,
                "promoCode" => $promoCode,
                "lengthOfStay" => $lengthOfStay,
                "user" => $user,
            ]);
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->with("warning", "Data kamar tidak ditemukan.");
        } catch (\Exception $e) {
            report($e);
            return back()->with("error", "Terjadi kesalahan menampilkan data reservasi kamar.");
        }
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

            $reservation = DB::transaction(function () use (
                $userData,
                $guestData,
                $reservation,
                $reservationRoom,
                $validated
            ) {
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

                $reservation = Reservation::create(array_merge(
                    $reservation,
                    ["booking_number" => ReservationService::generateBookingNumber()]
                ));

                $reservation->reservationRoom()->create($reservationRoom);
                $reservation->reservationGuest()->create([
                    ...$reservationGuest,
                    "guest_id" => $guest->id,
                ]);

                Room::where('id', $reservationRoom['room_id'])
                    ->update(['condition' => 'BOOKED']);

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
                    "description" => $validated["advance_remarks"] ?: "Add Booking Advance",
                ]);

                return $reservation;
            });

            return redirect()->back()->with("data", [
                "reservation_id" => $reservation->id,
            ]);
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors(["message" => $e->getMessage()]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors(["message" => "Terjadi kesalahan menambahkan reservasi."]);
        }
    }

    public function history(Request $request)
    {
        $sort = $request->input('sort', 'desc');
        $status = $request->input('status', 'all');
        $search = $request->input('search', '');

        $user = Auth::user();
        $guest = $user->guest;

        $reservations = Reservation::with(
            "reservationRoom.roomType",
            "reservationGuest"
        )
            ->whereHas("reservationGuest", function ($query) use ($guest) {
                $query->where("guest_id", $guest->id);
            })
            ->when($status !== 'all', function ($query) use ($status) {
                $query->where("status", $status);
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where("booking_number", "like", "%$search%");
            })
            ->orderBy("created_at", $sort)
            ->get();

        $reservationStatus = ReservationStatusEnum::getValues();

        return Inertia::render("public/reservation/history", [
            "reservations" => $reservations,
            "sort" => $sort,
            "status" => $reservationStatus,
        ]);
    }

    public function payment(Request $request, string $id)
    {
        try {
            $reservation = Reservation::findOrFail($id);

            $reservation->update([
                "transaction_id" => $request->transaction_id,
                "transaction_time" => $request->transaction_time,
                "transaction_status" => $request->transaction_status,
                "payment_type" => $request->payment_type,
                "snap_token" => $request->snap_token,
                "transaction_bank" => $request?->bank ?? "",
            ]);

            return back();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                "message" => "Reservasi tidak ditemukan."
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                "message" => "Terjadi kesalahan memproses pembayaran."
            ]);
        }
    }
}
