<?php

namespace App\Http\Controllers\Guests;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guests\NationalityRequest;
use App\Http\Requests\Guests\UpdateNationalityRequest;
use App\Models\Guests\Nationality;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class NationalityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $nationalities = Nationality::with("user")->latest()->get();

        return Inertia::render("nationality/index", [
            "nationalities" => $nationalities,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(NationalityRequest $request)
    {
        //
        try {
            $nationality = Nationality::create($request->validated());
            $nationality->save();

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
    public function show(Nationality $nationality) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Nationality $nationality) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(NationalityRequest $request, string $id)
    {
        try {
            $nationality = Nationality::findOrFail($id);
            $nationality->update($request->validated());

            return redirect()->back();
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Kewarganegaraan tidak ditemukan'
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
            $nationality = Nationality::findOrFail($id);
            $nationality->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Kewarganegaraan tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }
}
