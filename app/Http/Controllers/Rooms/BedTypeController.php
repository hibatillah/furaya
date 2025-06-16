<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\BedTypeRequest;
use Inertia\Inertia;
use App\Models\Rooms\BedType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class BedTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bedTypes = BedType::latest()->get();

        return Inertia::render('bedtype/index', [
            'bedTypes' => $bedTypes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(BedTypeRequest $request)
    {
        try {
            BedType::create($request->validated());

            return redirect()->back();
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
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
    public function update(BedTypeRequest $request, string $id)
    {
        try {
            $bedType = BedType::findOrFail($id);
            $bedType->update($request->validated());

            // handle message in frontend
            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Tipe kasur tidak ditemukan'
            ]);
        } catch (\Exception $e) {
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
            $bedType = BedType::findOrFail($id);

            $bedType->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Tipe kasur tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }
}
