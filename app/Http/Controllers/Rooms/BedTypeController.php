<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\BedTypeRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BedType;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class BedTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bedTypes = BedType::orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('bedtype/index', [
            'bedTypes' => $bedTypes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('bedtype/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BedTypeRequest $request)
    {
        BedType::create($request->validated());
        return redirect()->route('bedtype.index')->with('success', 'Tipe tempat tidur berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $bedType = BedType::findOrFail($id);
            return Inertia::render('bedtype/show', [
                'bedType' => $bedType,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Tipe tempat tidur tidak ditemukan');
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
            $bedType = BedType::findOrFail($id);
            return Inertia::render('bedtype/edit', [
                'bedType' => $bedType,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Tipe tempat tidur tidak ditemukan');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BedTypeRequest $request, string $id)
    {
        try {
            $bedType = BedType::findOrFail($id);
            $bedType->update($request->validated());
            return redirect()->route('bedtype.show', ['id' => $id])
                ->with('success', 'Tipe tempat tidur berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Tipe tempat tidur tidak ditemukan');
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
            $bedType = BedType::findOrFail($id);
            $bedType->delete();
            return redirect()->back()->with('success', 'Tipe tempat tidur berhasil dihapus.');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('warning', 'Tipe tempat tidur tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
