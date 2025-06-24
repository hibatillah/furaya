<?php

namespace App\Http\Controllers\Reservations;

use App\Models\Reservations\GuestType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\GuestTypeRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class GuestTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $guestTypes = GuestType::with("user")->latest()->get();

        return Inertia::render("guest-type/index", [
            "guestTypes" => $guestTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GuestTypeRequest $request)
    {
        try {
            $guestType = GuestType::create($request->validated());
            $guestType->save();

            return redirect()->back();
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menambahkan tipe tamu."
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(GuestTypeRequest $request, string $id)
    {
        try {
            $guestType = GuestType::findOrFail($id);
            $guestType->update($request->validated());

            return redirect()->back();
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Tipe tamu tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan memperbarui tipe tamu."
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $guestType = GuestType::findOrFail($id);
            $guestType->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Tipe tamu tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menghapus tipe tamu."
            ]);
        }
    }
}
