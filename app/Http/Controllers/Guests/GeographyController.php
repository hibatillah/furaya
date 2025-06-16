<?php

namespace App\Http\Controllers\Guests;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guests\GeographyRequest;
use App\Models\Guests\Geography;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class GeographyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $geographies = Geography::with("user")->latest()->get();

        return Inertia::render("geography/index", [
            "geographies" => $geographies,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(GeographyRequest $request)
    {
        //
        try {
            $geography = Geography::create($request->validated());
            $geography->save();

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
    public function show(Geography $geography) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Geography $geography) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(GeographyRequest $request, string $id)
    {
        try {
            $geography = Geography::findOrFail($id);
            $geography->update($request->validated());

            return redirect()->back();
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Geografi tidak ditemukan'
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
            $geography = Geography::findOrFail($id);
            $geography->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Geografi tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }
}
