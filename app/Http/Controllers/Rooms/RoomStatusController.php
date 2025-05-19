<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\BedType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::with("roomType", "bedType")->orderBy("updated_at", "desc")->paginate(10);
        $roomTypes = RoomType::all();
        $bedTypes = BedType::all();

        return Inertia::render("room-status/index", [
            "rooms" => $rooms,
            "roomTypes" => $roomTypes,
            "bedTypes" => $bedTypes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store() {}

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

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
    public function destroy(string $id) {}
}
