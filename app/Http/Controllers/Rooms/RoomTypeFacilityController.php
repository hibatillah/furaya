<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Models\RoomTypeFacility;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class RoomTypeFacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}

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
    public function update(Request $request, string $id) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $roomTypeFacility = RoomTypeFacility::findOrFail($id);

            $roomTypeFacility->delete();

            Log::channel('project')->info('RoomTypeFacility deleted', [
                'user_id' => Auth::user()->id,
                'table' => 'room_type_facilities',
                'record_id' => $id,
            ]);

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            Log::channel('project')->error('RoomTypeFacility not found', [
                'user_id' => Auth::user()->id,
                'table' => 'room_type_facilities',
                'record_id' => $id,
            ]);

            return back()->withErrors([
                'message' => 'Fasilitas Tipe Kamar tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            Log::channel('project')->error('Deleting RoomTypeFacility', [
                'user_id' => Auth::user()->id,
                'table' => 'room_type_facilities',
                'record_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors([
                'message' => $e->getMessage(),
            ]);
        }
    }
}
