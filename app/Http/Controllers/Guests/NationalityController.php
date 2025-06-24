<?php

namespace App\Http\Controllers\Guests;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guests\NationalityRequest;
use App\Models\Guests\Nationality;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menambahkan kewarganegaraan.",
            ]);
        }
    }

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
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Kewarganegaraan tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan memperbarui kewarganegaraan.",
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
            report($e);
            return back()->withErrors([
                'message' => 'Kewarganegaraan tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menghapus kewarganegaraan.",
            ]);
        }
    }
}
