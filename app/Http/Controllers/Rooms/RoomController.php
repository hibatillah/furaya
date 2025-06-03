<?php

namespace App\Http\Controllers\Rooms;

use App\Enums\RoomConditionEnum;
use App\Enums\RoomStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\RoomRequest;
use App\Models\BedType;
use App\Models\Facility;
use App\Models\Room;
use App\Models\RoomFacility;
use App\Models\RoomType;
use App\Utils\DateHelper;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RoomController extends Controller
{
    protected $roomTypes;
    protected $bedTypes;
    protected $dateISO;

    public function __construct()
    {
        $this->roomTypes = RoomType::all();
        $this->bedTypes = BedType::all();
        $this->dateISO = DateHelper::getISO();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::with("roomType", "bedType")->orderBy("created_at", "desc")->get();
        $roomConditions = RoomConditionEnum::getValues();

        return Inertia::render("rooms/index", [
            "rooms" => $rooms,
            "roomTypes" => $this->roomTypes,
            "bedTypes" => $this->bedTypes,
            "roomConditions" => $roomConditions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $statusOptions = RoomStatusEnum::getValues();
        $roomConditions = RoomConditionEnum::getValues();
        $facilities = Facility::all();

        return Inertia::render("rooms/create", [
            "roomTypes" => $this->roomTypes,
            "bedTypes" => $this->bedTypes,
            "statusOptions" => $statusOptions,
            "roomConditions" => $roomConditions,
            "facilities" => $facilities,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoomRequest $request)
    {
        try {
            $validated = $request->validated();

            $result = DB::transaction(function () use ($validated) {
                // create room
                $room = Room::create(Arr::except($validated, ["facilities"]));

                if (count($validated["facilities"]) > 0) {
                    // define room facilities
                    $facilities = [];
                    foreach ($validated['facilities'] as $facilityId) {
                        $facilities[] = [
                            'id' => Str::uuid(),
                            'room_id' => $room->id,
                            'facility_id' => $facilityId,
                            'created_at' => $this->dateISO,
                            'updated_at' => $this->dateISO,
                        ];
                    }

                    // create many room facilities
                    RoomFacility::insert($facilities);
                }

                // return result to get record id for logging
                return (object) [
                    "room" => $room,
                ];
            });

            Log::channel("project")->info("Room created", [
                "user_id" => Auth::user()->id,
                "table" => "rooms",
                "record_id" => $result->room->id,
            ]);

            return redirect()->route("room.show", ["id" => $result->room->id])->with("success", "Kamar berhasil ditambahkan");
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::channel("project")->error("Creating room", [
                "user_id" => Auth::user()->id,
                "table" => "rooms",
                "error" => $e->getMessage(),
            ]);

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

            return Inertia::render("rooms/show", [
                "room" => $room,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Room not found", [
                "user_id" => Auth::user()->id,
                "table" => "rooms",
            ]);

            return redirect()->back()->with("warning", "Kamar tidak ditemukan");
        } catch (\Exception $e) {
            Log::channel("project")->error("Error showing room", [
                "user_id" => Auth::user()->id,
                "table" => "rooms",
            ]);

            return redirect()->back()->with("error", $e->getMessage());
        }
    }

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
            Log::channel("project")->error("Room not found", [
                "user_id" => Auth::user()->id,
                "table" => "rooms",
            ]);

            return redirect()->back()->with("warning", "Kamar tidak ditemukan");
        } catch (\Exception $e) {
            Log::channel("project")->error("Showing edit room page", [
                "user_id" => Auth::user()->id,
                "table" => "rooms",
            ]);

            return redirect()->back()->with("error", $e->getMessage());
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

            Log::channel('project')->info('Room updated', [
                'user_id' => Auth::user()->id,
                'table' => 'rooms',
                'record_id' => $room->id,
            ]);

            return redirect()->route("room.show", ["id" => $id])->with("success", "Kamar berhasil diperbarui");
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Room not found", [
                "user_id" => Auth::user()->id,
                "table" => "rooms",
            ]);

            return back()->withErrors([
                "message" => "Kamar tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Updating room", [
                "user_id" => Auth::user()->id,
                "table" => "rooms",
            ]);

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

            Log::channel('project')->info('Room deleted', [
                'user_id' => Auth::user()->id,
                'table' => 'rooms',
                'record_id' => $room->id,
            ]);

            $room->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Room not found", [
                "user_id" => Auth::user()->id,
                "table" => "rooms",
            ]);

            return redirect()->back()->withErrors([
                "message" => "Kamar tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Deleting room", [
                "user_id" => Auth::user()->id,
                "table" => "rooms",
            ]);

            return redirect()->back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }
}
