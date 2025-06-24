<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\RateTypeRequest;
use App\Models\Rooms\RateType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RateTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rateTypes = RateType::latest()->get();

        return Inertia::render("rate-type/index", [
            "rateTypes" => $rateTypes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(RateTypeRequest $request)
    {
        try {
            $validated = $request->validated();
            RateType::create($validated);

            return redirect()->back();
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menambahkan tipe tarif."
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RateTypeRequest $request, string $id)
    {
        try {
            $rateType = RateType::findOrFail($id);
            $rateType->update($request->validated());

            return redirect()->back();
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Tipe tarif tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan memperbarui tipe tarif."
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $rateType = RateType::findOrFail($id);
            $rateType->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Tipe tarif tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menghapus tipe tarif."
            ]);
        }
    }
}
