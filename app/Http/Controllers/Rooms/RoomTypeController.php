<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\RoomTypeRequest;
use Inertia\Inertia;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class RoomTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roomTypes = RoomType::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('roomtype/index', [
            'roomTypes' => $roomTypes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('roomtype/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoomTypeRequest $request)
    {
        $roomType = RoomType::create($request->validated());

        Log::channel('project')->info('RoomType created', [
            'user_id' => Auth::user()->id,
            'table' => 'room_types',
            'record_id' => $roomType->id,
        ]);

        return redirect()->route('roomtype.index')->with('success', 'Tipe kamar berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $roomType = RoomType::findOrFail($id);

            return Inertia::render('roomtype/edit', [
                'roomType' => $roomType,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('warning', 'Tipe kamar tidak ditemukan');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoomTypeRequest $request, string $id)
    {
        try {
            $roomType = RoomType::findOrFail($id);
            $roomType->update($request->validated());

            Log::channel('project')->info('RoomType updated', [
                'user_id' => Auth::user()->id,
                'table' => 'room_types',
                'record_id' => $roomType->id,
            ]);

            return redirect()->route('roomtype.index')->with('success', 'Tipe kamar berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            return back()->with('warning', 'Tipe kamar tidak ditemukan');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
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
            return redirect()->back()->with('warning', 'Tipe kamar tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
