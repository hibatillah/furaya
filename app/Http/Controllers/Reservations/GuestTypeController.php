<?php

namespace App\Http\Controllers\Reservations;

use App\Models\Reservations\GuestType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\GuestTypeRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
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
     * Show the form for creating a new resource.
     */
    public function create() {}

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
            Log::channel("project")->error("Creating guest type", [
                "table" => "guest_types",
                "error" => $e->getMessage(),
            ]);

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
    public function show(GuestType $guestType) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GuestType $guestType) {}

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
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Tipe tamu tidak ditemukan'
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
            $guestType = GuestType::findOrFail($id);
            $guestType->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Tipe tamu tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }
}
