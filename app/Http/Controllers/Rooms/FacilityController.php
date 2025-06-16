<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Models\Rooms\Facility;
use App\Http\Requests\Rooms\FacilityRequest;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class FacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $facilities = Facility::latest()->get();

        return Inertia::render('facility/index', [
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
    public function store(FacilityRequest $request)
    {
        try {
            $validated = $request->validated();
            Facility::create($validated);

            // handle message in frontend
            return redirect()->back();
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => $e->getMessage(),
            ])->withInput();
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
    public function update(FacilityRequest $request, string $id)
    {
        try {
            $facility = Facility::findOrFail($id);
            $facility->update($request->validated());

            // handle message in frontend
            return redirect()->back();
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Fasilitas tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => $e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $facility = Facility::findOrFail($id);
            $facility->delete();

            // handle message in frontend
            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Fasilitas tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => $e->getMessage(),
            ]);
        }
    }
}
