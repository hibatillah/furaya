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
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menambahkan geografi.",
            ]);
        }
    }

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
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Geografi tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan memperbarui geografi.",
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
            report($e);
            return back()->withErrors([
                'message' => 'Geografi tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menghapus geografi.",
            ]);
        }
    }
}
