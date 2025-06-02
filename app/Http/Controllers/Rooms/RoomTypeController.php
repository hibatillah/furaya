<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\RoomTypeRequest;
use App\Models\Facility;
use App\Models\RoomTypeFacility;
use App\Utils\DateHelper;
use Inertia\Inertia;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class RoomTypeController extends Controller
{
    protected $dateISO;

    public function __construct()
    {
        $this->dateISO = DateHelper::getISO();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roomTypes = RoomType::with(['roomTypeFacility.facility', 'facility'])
            ->orderBy('created_at', 'desc')
            ->get();
        $facilities = Facility::all();

        return Inertia::render('roomtype/index', [
            'roomTypes' => $roomTypes,
            'facilities' => $facilities,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoomTypeRequest $request)
    {
        try {
            $validated = $request->validated();

            $result = DB::transaction(function () use ($validated) {
                // create room type
                $roomType = RoomType::create(Arr::except($validated, 'facilities'));

                // check if facilities is not empty
                if (count($validated['facilities']) > 0) {
                    // define room type facilities
                    $facilities = [];
                    foreach ($validated['facilities'] as $facilityId) {
                        $facilities[] = [
                            'id' => Str::uuid(),
                            'room_type_id' => $roomType->id,
                            'facility_id' => $facilityId,
                            'created_at' => $this->dateISO,
                            'updated_at' => $this->dateISO,
                        ];
                    }

                    // create many room type facilities
                    RoomTypeFacility::insert($facilities);
                }

                // return result to get record id for logging
                return (object) [
                    'roomType' => $roomType,
                ];
            });

            Log::channel('project')->info('RoomType created', [
                'user_id' => Auth::user()->id,
                'table' => 'room_types',
                'record_id' => $result->roomType->id,
            ]);

            return redirect()->back();
        } catch (ValidationException $e) {
            return back()->withErrors([
                'message' => $e->validator->errors()->first()
            ])->withInput();
        } catch (\Exception $e) {
            Log::channel("project")->error("Creating room type", [
                "user_id" => Auth::user()->id,
                "table" => "room_types",
                "error" => $e->getMessage(),
            ]);

            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(RoomTypeRequest $request, string $id)
    {
        try {
            $validated = $request->validated();
            $roomType = RoomType::findOrFail($id);

            DB::transaction(function () use ($validated, $roomType) {
                // update room type
                $roomType->update(Arr::except($validated, 'facilities'));

                // update room type facility
                $this->updateFacility($roomType->id, $validated['facilities']);

                // return result to get record id for logging
                return (object) [
                    'roomType' => $roomType,
                ];
            });

            Log::channel('project')->info('RoomType updated', [
                'user_id' => Auth::user()->id,
                'table' => 'room_types',
                'record_id' => $roomType->id,
            ]);

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("RoomType not found", [
                "user_id" => Auth::user()->id,
                "table" => "room_types",
            ]);

            return back()->withErrors([
                'message' => 'Tipe kamar tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Updating room type", [
                "user_id" => Auth::user()->id,
                "table" => "room_types",
                "error" => $e->getMessage(),
            ]);

            return back()->withErrors([
                'message' => $e->getMessage()
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

            Log::channel('project')->info('RoomType deleted', [
                'user_id' => Auth::user()->id,
                'table' => 'room_types',
                'record_id' => $roomType->id,
            ]);

            $roomType->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("RoomType not found", [
                "user_id" => Auth::user()->id,
                "table" => "room_types",
            ]);

            return back()->withErrors([
                'message' => 'Tipe kamar tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Deleting room type", [
                "user_id" => Auth::user()->id,
                "table" => "room_types",
                "error" => $e->getMessage(),
            ]);

            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }

    private function updateFacility(string $roomTypeId, array $requestFacilities)
    {
        $facilities = RoomTypeFacility::where('room_type_id', $roomTypeId)->get();

        // delete all exist facilities if request facilities is empty
        if (count($facilities) > 0 && count($requestFacilities) === 0) {
            RoomTypeFacility::where('room_type_id', $roomTypeId)->delete();
        } else {
            $existFacilityIds = $facilities->pluck('facility_id')->toArray();

            /**
             * Handle Create Facility
             *
             * if request facilities is not exist in room type facility
             */
            foreach ($requestFacilities as $facilityId) {
                if (!in_array($facilityId, $existFacilityIds)) {
                    RoomTypeFacility::create([
                        'room_type_id' => $roomTypeId,
                        'facility_id' => $facilityId,
                    ]);
                }
            }

            /**
             * Handle Delete Facility
             *
             * if exist facilities is not exist in request facilities
             */
            foreach ($existFacilityIds as $existFacilityId) {
                if (!in_array($existFacilityId, $requestFacilities)) {
                    $this->deleteFacility($roomTypeId, $existFacilityId);
                }
            }
        }
    }

    private function deleteFacility(string $roomTypeId, string $facilityId)
    {
        $facility = RoomTypeFacility::where('room_type_id', $roomTypeId)->where('facility_id', $facilityId)->first();

        if (!isset($facility)) throw new \Exception("Fasilitas tidak ditemukan");
        $facility->delete();
    }
}
