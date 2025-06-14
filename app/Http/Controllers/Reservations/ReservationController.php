<?php

namespace App\Http\Controllers\Reservations;

use App\Enums\BookingTypeEnum;
use App\Enums\GenderEnum;
use App\Enums\RoomPackageEnum;
use App\Enums\PaymentEnum;
use App\Enums\VisitPurposeEnum;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\Request;
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
        $rooms = Room::all();
        $roomTypes = RoomType::all();

        $visitPurposes = VisitPurposeEnum::getValues();
        $bookingTypes = BookingTypeEnum::getValues();
        $roomPackages = RoomPackageEnum::getValues();
        $paymentMethods = PaymentEnum::getValues();
        $genders = GenderEnum::getValues();

        return Inertia::render("reservation/create", [
            "rooms" => $rooms,
            "visitPurposes" => $visitPurposes,
            "bookingTypes" => $bookingTypes,
            "roomPackages" => $roomPackages,
            "roomTypes" => $roomTypes,
            "paymentMethods" => $paymentMethods,
            "genders" => $genders,
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
}
