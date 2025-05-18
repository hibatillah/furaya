<?php

namespace App\Http\Controllers\Rooms;

use App\Enums\RoomStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\RoomRequest;
use App\Models\BedType;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::with("roomType", "bedType")->orderBy("created_at", "desc")->paginate(10);

        return Inertia::render("rooms/index", [
            "rooms" => $rooms,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roomTypes = RoomType::all();
        $bedTypes = BedType::all();
        $statusOptions = RoomStatusEnum::getValues();

        return Inertia::render("rooms/create", [
            "roomTypes" => $roomTypes,
            "bedTypes" => $bedTypes,
            "statusOptions" => $statusOptions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoomRequest $request)
    {
        Room::create($request->validated());
        return redirect()->route("room.index")->with("success", "Kamar berhasil ditambahkan");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $room = Room::with("roomType", "bedType")->findOrFail($id);

            return Inertia::render("rooms/show", [
                "room" => $room,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with("error", "Kamar tidak ditemukan");
        } catch (\Exception $e) {
            return back()->with("error", $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $room = Room::findOrFail($id);
            $roomTypes = RoomType::all();
            $bedTypes = BedType::all();
            $statusOptions = RoomStatusEnum::getValues();

            return Inertia::render("rooms/edit", [
                "room" => $room,
                "roomTypes" => $roomTypes,
                "bedTypes" => $bedTypes,
                "statusOptions" => $statusOptions,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with("error", "Kamar tidak ditemukan");
        } catch (\Exception $e) {
            return back()->with("error", $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoomRequest $request, string $id)
    {
        try {
            $room = Room::findOrFail($id);
            $room->update($request->validated());

            return redirect()->route("room.show", ["id" => $id])
                ->with("success", "Kamar berhasil diperbarui");
        } catch (ModelNotFoundException $e) {
            return back()->with("error", "Kamar tidak ditemukan");
        } catch (\Exception $e) {
            return back()->with("error", $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $room = Room::findOrFail($id);
            $room->delete();

            return redirect()->back()->with("success", "Kamar berhasil dihapus.");
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with("warning", "Kamar tidak ditemukan");
        } catch (\Exception $e) {
            return redirect()->back()->with("error", $e->getMessage());
        }
    }
}
