<?php

namespace App\Http\Controllers\Rooms;

use App\Enums\RoomConditionEnum;
use App\Enums\RoomStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\RoomRequest;
use App\Models\Rooms\BedType;
use App\Models\Rooms\Facility;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomFacility;
use App\Models\Rooms\RoomType;
use App\Models\Rooms\RateType;
use App\Models\Rooms\Meal;
use App\Models\Reservations\Reservation;
use App\Utils\DateHelper;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RoomController extends Controller
{
    protected $dateISO;
    protected $roomTypes;
    protected $bedTypes;
    protected $roomConditions;
    protected $roomStatusLabels;
    protected $roomStatusValues;
    protected $rateTypes;
    protected $mealTypes;
    protected $facilities;

    public function __construct()
    {
        $this->dateISO = DateHelper::getISO();
        $this->roomTypes = RoomType::all();
        $this->bedTypes = BedType::all();
        $this->roomConditions = RoomConditionEnum::getValues();
        $this->roomStatusLabels = RoomStatusEnum::getLabels();
        $this->roomStatusValues = RoomStatusEnum::getValues();
        $this->rateTypes = RateType::all();
        $this->mealTypes = Meal::all();
        $this->facilities = Facility::all();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::with("roomType", "bedType")
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render("rooms/index", [
            "rooms" => $rooms,
            "roomTypes" => $this->roomTypes,
            "bedTypes" => $this->bedTypes,
            "roomConditions" => $this->roomConditions,
            "roomStatuses" => $this->roomStatusValues,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roomTypes = RoomType::with('facility')
            ->latest()
            ->get();

        return Inertia::render("rooms/create", [
            "bedTypes" => $this->bedTypes,
            "roomTypes" => $roomTypes,
            "rateTypes" => $this->rateTypes,
            "mealTypes" => $this->mealTypes,
            "roomConditions" => $this->roomConditions,
            "roomStatuses" => $this->roomStatusLabels,
            "facilities" => $this->facilities,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoomRequest $request)
    {
        try {
            $validated = $request->validated();
            $validated['status'] = RoomStatusEnum::getKeyValues()[$validated["status"]];

            $result = DB::transaction(function () use ($validated) {
                $facilities = $validated['facilities'];

                // create room
                $room = Room::create(Arr::except($validated, ["facilities", "image"]));

                if (count($facilities) > 0) {
                    foreach ($facilities as $facilityId) {
                        RoomFacility::create([
                            'room_id' => $room->id,
                            'facility_id' => $facilityId,
                        ]);
                    }
                }

                // return result to get record id for logging
                return (object) [
                    "room" => $room,
                ];
            });

            return redirect()->route("room.show", ["id" => $result->room->id])->with("success", "Kamar berhasil ditambahkan");
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
            $room = Room::with("roomType", "bedType")->findOrFail($id);
            $reservations = Reservation::with('reservationRoom')
                ->whereHas('reservationRoom', function ($query) use ($id) {
                    $query->where('room_id', $id);
                })
                ->orderBy('updated_at', 'desc')
                ->get();

            return Inertia::render("rooms/show", [
                "room" => $room,
                "reservations" => $reservations,
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->withErrors([
                "message" => "Kamar tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function edit(string $id)
    {
        try {
            $room = Room::with("roomType", "bedType")->findOrFail($id);
            $roomTypes = RoomType::with('facility')->latest()->get();

            return Inertia::render("rooms/edit", [
                "room" => $room,
                "bedTypes" => $this->bedTypes,
                "roomTypes" => $roomTypes,
                "rateTypes" => $this->rateTypes,
                "mealTypes" => $this->mealTypes,
                "roomConditions" => $this->roomConditions,
                "roomStatuses" => $this->roomStatusLabels,
                "facilities" => $this->facilities,
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->withErrors([
                "message" => "Kamar tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoomRequest $request, string $id)
    {
        try {
            $room = Room::findOrFail($id);
            $roomFacilities = RoomFacility::where('room_id', $room->id)->get();

            $validated = $request->validated();
            $validated['status'] = RoomStatusEnum::getKeyValues()[$validated["status"]];

            DB::transaction(function () use ($validated, $room, $roomFacilities) {
                // update room
                $room->update(Arr::except($validated, ["facilities", "image"]));

                // update room facility
                $facilities = $validated['facilities'];

                if (count($facilities) > 0) {
                    // delete room facility if not exists in updated facilities
                    foreach ($roomFacilities as $roomFacility) {
                        if (!in_array($roomFacility->facility_id, $facilities)) {
                            $roomFacility->delete();
                        }
                    }

                    // create facility if not exists in room facilities
                    foreach ($facilities as $facilityId) {
                        if (!in_array($facilityId, $roomFacilities->pluck('facility_id')->toArray())) {
                            RoomFacility::create([
                                'room_id' => $room->id,
                                'facility_id' => $facilityId,
                            ]);
                        }
                    }
                } else {
                    /**
                     * Delete all room facilities
                     * if updated facilities is empty
                     */
                    foreach ($roomFacilities as $roomFacility) {
                        $roomFacility->delete();
                    }
                }
            });

            return redirect()
                ->route("room.show", ["id" => $id])
                ->with("success", "Kamar berhasil diperbarui");
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                "message" => "Kamar tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
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

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->withErrors([
                "message" => "Kamar tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }
}
