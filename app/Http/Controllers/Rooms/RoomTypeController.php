<?php

namespace App\Http\Controllers\Rooms;

use App\Enums\SmokingTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\RoomTypeRequest;
use App\Models\Rooms\Facility;
use App\Models\Rooms\RateType;
use App\Models\Rooms\RoomTypeFacility;
use Inertia\Inertia;
use App\Models\Rooms\RoomType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RoomTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roomTypes = RoomType::with('facility', 'rateType')->latest()->get();
        $facilities = Facility::all();
        $rateTypes = RateType::all();
        $smokingTypes = SmokingTypeEnum::getValues();

        return Inertia::render('roomtype/index', [
            'roomTypes' => $roomTypes,
            'facilities' => $facilities,
            'rateTypes' => $rateTypes,
            'smokingTypes' => $smokingTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoomTypeRequest $request)
    {
        try {
            $validated = $request->validated();

            DB::transaction(function () use ($validated) {
                $facilities = $validated['facilities'];

                // create room type
                $roomType = RoomType::create(Arr::except($validated, 'facilities'));

                // check if facilities is not empty
                if (count($facilities) > 0) {
                    foreach ($facilities as $facilityId) {
                        RoomTypeFacility::create([
                            'room_type_id' => $roomType->id,
                            'facility_id' => $facilityId,
                        ]);
                    }
                }
            });

            return redirect()->back();
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors([
                'message' => $e->validator->errors()->first()
            ])->withInput();
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menambahkan tipe kamar."
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoomTypeRequest $request, string $id)
    {
        try {
            $validated = $request->validated();
            $roomType = RoomType::findOrFail($id);
            $roomTypeFacilities = RoomTypeFacility::where('room_type_id', $roomType->id)->get();

            DB::transaction(function () use ($validated, $roomType, $roomTypeFacilities) {
                // update room type
                $roomType->update(Arr::except($validated, 'facilities'));

                // update room type facility
                $facilities = $validated['facilities'];

                if (count($facilities) > 0) {
                    // delete room type facility if not exists in updated facilities
                    foreach ($roomTypeFacilities as $roomTypeFacility) {
                        if (!in_array($roomTypeFacility->facility_id, $facilities)) {
                            $roomTypeFacility->delete();
                        }
                    }

                    // create facility if not exists in room type facilities
                    foreach ($facilities as $facilityId) {
                        if (!in_array($facilityId, $roomTypeFacilities->pluck('facility_id')->toArray())) {
                            RoomTypeFacility::create([
                                'room_type_id' => $roomType->id,
                                'facility_id' => $facilityId,
                            ]);
                        }
                    }
                } else {
                    /**
                     * Delete all room type facilities
                     * if updated facilities is empty
                     */
                    foreach ($roomTypeFacilities as $roomTypeFacility) {
                        $roomTypeFacility->delete();
                    }
                }
            });

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Tipe kamar tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan memperbarui tipe kamar."
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $roomType = RoomType::findOrFail($id);
            $roomType->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Tipe kamar tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menghapus tipe kamar."
            ]);
        }
    }
}
