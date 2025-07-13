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
    // grouping admin routes
    Route::prefix('admin')->group(function () {
        // dashboard route
        Route::get('dashboard', [DashboardController::class, 'index'])
            ->name('dashboard')
            ->middleware('role:admin,manager,employee');

        /** custom reservation routes*/
        Route::middleware("role:employee")->group(function () {
            // update reservation status
            Route::put("reservasi/{id}/status", [
                ReservationController::class,
                "updateStatus"
            ])
                ->name("reservation.update.status");

            // reservation confirm page
            Route::get("reservasi/{id}/konfirmasi", [
                ReservationController::class,
                "confirm"
            ])
                ->name("reservation.confirm");

            // reservation reject
            Route::put("reservasi/{id}/tolak", [
                ReservationController::class,
                "reject"
            ])
                ->name("reservation.reject");

            // reservation create page
            Route::get("reservasi/tambah", [
                ReservationController::class,
                "create"
            ])
                ->name("reservation.create");

            // get available rooms for reservation
            Route::get('/reservasi/kamar/tersedia', [
                ReservationController::class,
                'getAvailableRooms'
            ])
                ->name('reservation.available-rooms');

            // get available room types for reservation
            Route::get('/reservasi/tipe-kamar/tersedia', [
                ReservationController::class,
                'getAvailableRoomTypes'
            ])
                ->name('reservation.available-room-types');

            // get guest data for reservation
            Route::get('/reservasi/tamu', [
                ReservationController::class,
                'getGuest'
            ])
                ->name('reservation.guest');
        });

        /** reservation routes for managers and employees */
        Route::middleware("role:manager,employee")->group(function () {
            // reservation transaction history for managers and employees
            Route::get("reservasi/{id}/transaksi", [
                ReservationTransactionController::class,
                "index"
            ])
                ->name("reservation.transaction");

            // add other reservation routes for managers and employees
            Route::resource("reservasi", ReservationController::class)
                ->only(["index", "show"])
                ->parameters(["reservasi" => "id"])
                ->names([
                    "index" => "reservation.index",
                    "show" => "reservation.show",
                ]);
        });

        /** room routes for admin and employee */
        Route::middleware("role:admin,employee")->group(function () {
            /** update room status for admin and employee */
            Route::put("kamar/{id}/status", [RoomController::class, "updateStatus"])
                ->name("room.update.status");

            /** room index route */
            Route::get("kamar", [RoomController::class, "index"])
                ->name("room.index");
        });

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

        require __DIR__ . '/roles/admins.php';
        require __DIR__ . '/roles/employees.php';
        require __DIR__ . '/roles/managers.php';
    });

    // Fallback route MUST be the very last route
    Route::fallback(function () {
        return Inertia::render('not-found');
    })->name('not-found');
});

require __DIR__ . '/roles/guest.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
