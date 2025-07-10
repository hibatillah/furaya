<?php

namespace App\Http\Controllers\Rooms;

use App\Enums\RoomConditionEnum;
use App\Enums\RoomStatusEnum;
use App\Enums\SmokingTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\RoomRequest;
use App\Models\Rooms\BedType;
use App\Models\Rooms\Facility;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomFacility;
use App\Models\Rooms\RoomType;
use App\Models\Rooms\RateType;
use App\Models\Reservations\Reservation;
use App\Utils\Helper;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::with("roomType", "bedType")
            ->orderBy('updated_at', 'desc')
            ->get();

        $roomTypes = RoomType::all();
        $bedTypes = BedType::all();

        $roomConditions = RoomConditionEnum::getValues();
        $roomStatusValues = RoomStatusEnum::getValues();

        return Inertia::render("rooms/index", [
            "rooms" => $rooms,
            "roomTypes" => $roomTypes,
            "bedTypes" => $bedTypes,
            "roomConditions" => $roomConditions,
            "roomStatuses" => $roomStatusValues,
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

        $bedTypes = BedType::all();
        $rateTypes = RateType::all();
        $facilities = Facility::all();

        $roomConditions = RoomConditionEnum::getValues();
        $roomStatusLabels = RoomStatusEnum::getLabels();
        $smokingTypes = SmokingTypeEnum::getValues();

        return Inertia::render("rooms/create", [
            "bedTypes" => $bedTypes,
            "roomTypes" => $roomTypes,
            "rateTypes" => $rateTypes,
            "roomConditions" => $roomConditions,
            "roomStatuses" => $roomStatusLabels,
            "facilities" => $facilities,
            "smokingTypes" => $smokingTypes,
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
                $roomType = RoomType::findOrFail($validated['room_type_id']);
                $facilities = $validated['facilities'];

                // store and get image paths
                $imagePaths = Helper::storeImage(
                    files: request()->file('images') ?? [],
                    prefix: $validated['room_number'],
                    folder: 'rooms'
                );

                // store room layout
                $roomLayout = request()->file('room_layout');
                $layoutPath = Helper::storeImage(
                    files: $roomLayout ? [$roomLayout] : [],
                    prefix: $validated['room_number'],
                    folder: 'rooms'
                );

                // create room
                $room = Room::create([
                    ...Arr::except($validated, ["facilities"]),
                    "images" => [
                        ...$roomType->images,
                        ...$imagePaths,
                    ],
                    "room_layout" => $layoutPath[0] ?? null,
                ]);

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
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                "message" => "Terjadi kesalahan menambahkan kamar.",
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
            report($e);
            return redirect()->back()->withErrors([
                "message" => "Kamar tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->withErrors([
                "message" => "Terjadi kesalahan menampilkan data kamar.",
            ]);
        }
    }

    public function edit(string $id)
    {
        try {
            $room = Room::with("roomType", "bedType")->findOrFail($id);
            $roomTypes = RoomType::with('facility')->latest()->get();

            $bedTypes = BedType::all();
            $rateTypes = RateType::all();
            $facilities = Facility::all();

            $roomConditions = RoomConditionEnum::getValues();
            $roomStatusLabels = RoomStatusEnum::getLabels();
            $smokingTypes = SmokingTypeEnum::getValues();

            return Inertia::render("rooms/edit", [
                "room" => $room,
                "bedTypes" => $bedTypes,
                "roomTypes" => $roomTypes,
                "rateTypes" => $rateTypes,
                "roomConditions" => $roomConditions,
                "roomStatuses" => $roomStatusLabels,
                "facilities" => $facilities,
                "smokingTypes" => $smokingTypes,
            ]);
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            report($e);
            return redirect()->back()->withErrors([
                "message" => "Kamar tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->withErrors([
                "message" => "Terjadi kesalahan memperbarui kamar.",
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

            DB::transaction(function () use (
                $validated,
                $room,
                $roomFacilities
            ) {
                $roomType = RoomType::findOrFail($validated['room_type_id']);

                $images = is_array($room->images) ? $room->images : [];
                $oldImages = array_filter($images, fn($image) => str_starts_with($image, 'rooms/'));

                // update room images
                $imagePaths = Helper::updateImage(
                    newFiles: request()->file('images') ?? [],
                    oldFiles: $oldImages,
                    prefix: $validated['room_number'],
                    folder: 'rooms'
                );

                // update room layout
                $roomLayout = request()->file('room_layout');
                $layoutPath = Helper::storeImage(
                    files: $roomLayout ? [$roomLayout] : [],
                    prefix: $validated['room_number'],
                    folder: 'rooms'
                );

                // update room
                $room->update([
                    ...Arr::except($validated, ["facilities"]),
                    "images" => [
                        ...$roomType->images,
                        ...$imagePaths,
                    ],
                    "room_layout" => $layoutPath[0] ?? null,
                ]);

                // update room facility
                $facilities = $validated['facilities'] ?? [];

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
            report($e);
            return back()->withErrors([
                "message" => "Kamar tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                "message" => "Terjadi kesalahan memperbarui kamar.",
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

            // delete room images
            foreach ($room->images as $image) {
                // just delete room images not room type images
                if (str_starts_with($image, 'rooms/')) {
                    Helper::deleteImage($image);
                }
            }

            // delete room layout
            if ($room->room_layout) {
                Helper::deleteImage($room->room_layout);
            }

            // delete room
            $room->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            report($e);
            return redirect()->back()->withErrors([
                "message" => "Kamar tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->withErrors([
                "message" => "Terjadi kesalahan mengubah status kamar.",
            ]);
        }
    }

    /**
     * Update room status
     */
    public function updateStatus(Request $request, string $id)
    {
        try {
            $status = $request->input("status");

            if (!$status) {
                throw new \Exception("Status tidak valid");
            }

            $room = Room::findOrFail($id);
            $room->update([
                "status" => $status,
            ]);

            return back();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                "message" => "Kamar tidak ditemukan",
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                "message" => "Terjadi kesalahan mengubah status kamar.",
            ]);
        }
    }
}
