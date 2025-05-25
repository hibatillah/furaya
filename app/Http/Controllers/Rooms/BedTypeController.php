<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\BedTypeRequest;
use Inertia\Inertia;
use App\Models\BedType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

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
        $bedType = BedType::create($request->validated());

        Log::channel('project')->info('BedType created', [
            'user_id' => Auth::user()->id,
            'table' => 'bed_types',
            'record_id' => $bedType->id,
        ]);

        return redirect()->route('bedtype.index')->with('success', 'Tipe kasur berhasil ditambahkan');
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
            $bedType = BedType::findOrFail($id);

            return Inertia::render('bedtype/edit', [
                'bedType' => $bedType,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("BedType not found", [
                "user_id" => Auth::user()->id,
                "table" => "bed_types",
            ]);

            return back()->with('warning', 'Tipe kasur tidak ditemukan');
        } catch (\Exception $e) {
            Log::channel("project")->error("Showing edit bed type page", [
                "user_id" => Auth::user()->id,
                "table" => "bed_types",
            ]);

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

            Log::channel('project')->info('BedType updated', [
                'user_id' => Auth::user()->id,
                'table' => 'bed_types',
                'record_id' => $bedType->id,
            ]);

            return redirect()->route('bedtype.index')->with('success', 'Tipe kasur berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("BedType not found", [
                "user_id" => Auth::user()->id,
                "table" => "bed_types",
            ]);

            return back()->with('warning', 'Tipe kasur tidak ditemukan');
        } catch (\Exception $e) {
            Log::channel("project")->error("Updating bed type", [
                "user_id" => Auth::user()->id,
                "table" => "bed_types",
            ]);

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

            Log::channel('project')->info('BedType deleted', [
                'user_id' => Auth::user()->id,
                'table' => 'bed_types',
                'record_id' => $bedType->id,
            ]);

            $bedType->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("BedType not found", [
                "user_id" => Auth::user()->id,
                "table" => "bed_types",
            ]);

            return redirect()->back()->with('warning', 'Tipe kasur tidak ditemukan');
        } catch (\Exception $e) {
            Log::channel("project")->error("Deleting bed type", [
                "user_id" => Auth::user()->id,
                "table" => "bed_types",
            ]);

            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
