<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
    public function store(Request $request)
    {
        RoomType::create($request->all());
        return redirect()->route('roomtype.index')->with('success', 'Tipe kamar berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $roomType = RoomType::findOrFail($id);
            return Inertia::render('roomtype/show', [
                'roomType' => $roomType,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Tipe kamar tidak ditemukan');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

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
            return back()->with('error', 'Tipe kamar tidak ditemukan');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $roomType = RoomType::findOrFail($id);
            $roomType->update($request->all());
            return redirect()->route('roomtype.show', ['id' => $id])
                ->with('success', 'Tipe kamar berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Tipe kamar tidak ditemukan');
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
            $roomType->delete();
            return redirect()->back()->with('success', 'Tipe kamar berhasil dihapus.');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('warning', 'Tipe kamar tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
