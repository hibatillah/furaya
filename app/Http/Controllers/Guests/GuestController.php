<?php

namespace App\Http\Controllers\Guests;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guests\GuestRequest;
use Inertia\Inertia;
use App\Models\Guests\Guest;
use App\Models\Reservations\ReservationGuest;
use App\Utils\Helper;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class GuestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $guests = Guest::with('user')->latest()->get();

        return Inertia::render('guest/index', [
            'guests' => $guests,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GuestRequest $request)
    {
        try {
            Guest::create($request->validated());

            return redirect()->route('guest.index')->with('success', 'Guest berhasil ditambahkan');
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menambahkan tamu.",
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $guest = Guest::with('user')->findOrFail($id);
            $reservations = ReservationGuest::with('reservation.reservationRoom.room')
                ->where('guest_id', $id)
                ->latest()
                ->get();

            return Inertia::render('guest/show', [
                'guest' => $guest,
                'reservations' => $reservations,
            ]);
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->with('error', 'Guest tidak ditemukan');
        } catch (\Exception $e) {
            report($e);
            return back()->with('error', "Terjadi kesalahan menampilkan data tamu.");
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $guest = Guest::with('user')->findOrFail($id);
            $countries = Helper::getCountry();

            return Inertia::render('guest/edit', [
                'guest' => $guest,
                'countries' => $countries,
            ]);
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Guest tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menampilkan data tamu.",
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(GuestRequest $request, string $id)
    {
        try {
            $guest = Guest::with('user')->findOrFail($id);

            // validate request
            $validated = $request->validated();

            $data = [
                'user' => Arr::only($validated, ['name', 'email']),
                'guest' => Arr::except($validated, ['name', 'email']),
            ];

            // Update user and customer data
            DB::transaction(function () use ($guest, $data) {
                $guest->user->update($data['user']);
                $guest->update($data['guest']);
            });

            return redirect()->route('guest.show', ['id' => $id])->with('success', 'Guest berhasil diperbarui');
        } catch (ValidationException $e) {
            report($e);
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Guest tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan memperbarui tamu.",
            ])->withInput();
        }
    }
}
