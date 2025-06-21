<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Guests\GuestController;
use App\Http\Controllers\Reservations\ReservationController;
use App\Http\Controllers\Reservations\ReservationTransactionController;
use App\Http\Controllers\Rooms\RoomController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    /** reservation transaction history for managers and employees */
    Route::get("reservasi/{id}/transaksi", [ReservationTransactionController::class, "index"])
        ->name("reservation.transaction")
        ->middleware("role:manager,employee");

    /** add new reservations for employees only */
    Route::middleware("role:employee")->group(function () {
        // update reservation status
        Route::put("reservasi/{id}/status", [ReservationController::class, "updateStatus"])
            ->name("reservation.update.status");

        // reservation create page
        Route::get("reservasi/tambah", [ReservationController::class, "create"])
            ->name("reservation.create");

        // get available rooms for reservation
        Route::get('/reservasi/kamar/tersedia', [ReservationController::class, 'getAvailableRooms'])
            ->name('reservation.available-rooms');

        // get available room types for reservation
        Route::get('/reservasi/tipe-kamar/tersedia', [ReservationController::class, 'getAvailableRoomTypes'])
            ->name('reservation.available-room-types');

        // get guest data for reservation
        Route::get('/reservasi/tamu', [ReservationController::class, 'getGuest'])
            ->name('reservation.guest');
    });

    /** add other reservation routes for managers and employees */
    Route::resource("reservasi", ReservationController::class)
        ->only(["index", "show"])
        ->parameters(["reservasi" => "id"])
        ->names([
            "index" => "reservation.index",
            "show" => "reservation.show",
        ])
        ->middleware("role:manager,employee");

    Route::resource("reservasi", ReservationController::class)
        ->only(["store", "edit", "update"])
        ->parameters(["reservasi" => "id"])
        ->names([
            "store" => "reservation.store",
            "edit" => "reservation.edit",
            "update" => "reservation.update",
        ])
        ->middleware("role:employee");

    /** guest resource routes for managers and admins */
    Route::resource("tamu", GuestController::class)
        ->except(["create", "destroy"])
        ->parameters(["tamu" => "id"])
        ->names([
            "index" => "guest.index",
            "store" => "guest.store",
            "show" => "guest.show",
            "edit" => "guest.edit",
            "update" => "guest.update",
        ])
        ->middleware("role:manager,admin");

    /** room resource routes for admin and employee */
    Route::middleware("role:admin,employee")->group(function () {
        /** crete room page */
        Route::get("kamar/tambah", [RoomController::class, "create"])
            ->name("room.create");

        /** update room status */
        Route::put("kamar/{id}/status", [RoomController::class, "updateStatus"])
            ->name("room.update.status");

        /** show room page routes */
        Route::resource("/kamar", RoomController::class)
            ->only(["index", "show"])
            ->parameters(["kamar" => "id"])
            ->names([
                "index" => "room.index",
                "show" => "room.show",
            ]);
    });

    // IMPORTANT: This fallback route MUST be the very last route
    Route::fallback(function () {
        return Inertia::render('not-found');
    })->name('not-found');
});

require __DIR__ . '/roles/admins.php';
require __DIR__ . '/roles/employees.php';
require __DIR__ . '/roles/managers.php';

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
