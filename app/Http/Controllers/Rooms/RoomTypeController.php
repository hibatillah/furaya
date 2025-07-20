<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\RoomTypeRequest;
use App\Models\Rooms\BedType;
use App\Models\Rooms\Facility;
use App\Models\Rooms\RateType;
use App\Models\Rooms\RoomTypeFacility;
use Inertia\Inertia;
use App\Models\Rooms\RoomType;
use App\Utils\Helper;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RoomTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bedTypes = BedType::all();
        $roomTypes = RoomType::with('facility', 'rateType', 'bedType')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('roomtype/index', [
            'roomTypes' => $roomTypes,
            'bedTypes' => $bedTypes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $facilities = Facility::all();
        $rateTypes = RateType::all();
        $bedTypes = BedType::all();

        return Inertia::render('roomtype/create', [
            'facilities' => $facilities,
            'rateTypes' => $rateTypes,
            'bedTypes' => $bedTypes,
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
                $facilities = $validated['facilities'] ?? [];

                // store and get image paths
                $imagePaths = Helper::storeImage(
                    files: request()->file('images') ?? [],
                    prefix: $validated['name'],
                    folder: 'room_types'
                );

                // create room type
                $roomType = RoomType::create([
                    ...Arr::except($validated, ['facilities']),
                    'images' => $imagePaths,
                ]);

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

            return redirect()->route('roomtype.index')->with('success', 'Tipe kamar berhasil ditambahkan');
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menambahkan tipe kamar."
            ]);
        }
    }

    /**
     * Show the specified resource.
     */
    public function show(string $id)
    {
        $roomType = RoomType::with('facility', 'rateType', 'bedType')->findOrFail($id);

        return Inertia::render('roomtype/show', [
            'roomType' => $roomType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $roomType = RoomType::with('facility', 'rateType', 'bedType')
            ->findOrFail($id);
        $facilities = Facility::all();
        $rateTypes = RateType::all();
        $bedTypes = BedType::all();

        return Inertia::render('roomtype/edit', [
            'roomType' => $roomType,
            'facilities' => $facilities,
            'rateTypes' => $rateTypes,
            'bedTypes' => $bedTypes,
        ]);
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

            DB::transaction(function () use (
                $validated,
                $roomType,
                $roomTypeFacilities,
            ) {
                // update image paths
                $imagePaths = Helper::updateImage(
                    newFiles: request()->file('images') ?? [],
                    oldFiles: $roomType->images ?? [],
                    prefix: $validated['name'],
                    folder: 'room_types'
                );

                // update room type
                $roomType->update([
                    ...Arr::except($validated, ['facilities']),
                    'images' => $imagePaths,
                ]);

                // update room type facility
                $facilities = $validated['facilities'] ?? [];

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

            return redirect()->route('roomtype.index')->with('success', 'Tipe kamar berhasil diperbarui');
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
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

            // delete room type images
            foreach ($roomType->images as $image) {
                Helper::deleteImage($image);
            }

            // delete room type
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
