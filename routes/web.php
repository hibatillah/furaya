<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Guests\GuestController;
use App\Http\Controllers\Reservations\ReservationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    /** add new reservations for employees only */
    Route::middleware("role:employee")->group(function () {
        Route::get("reservasi/tambah", [ReservationController::class, "create"])
            ->name("reservation.create");
        Route::get('/reservasi/kamar/tersedia', [ReservationController::class, 'getAvailableRooms'])
            ->name('reservation.available-rooms');
        Route::get('/reservasi/tamu', [ReservationController::class, 'getGuest'])
            ->name('reservation.guest');
    });

    /** add other reservation routes for managers and employees */
    Route::resource("reservasi", ReservationController::class)
        ->except(["create", "destroy"])
        ->parameters(["reservasi" => "id"])
        ->names([
            "index" => "reservation.index",
            "store" => "reservation.store",
            "show" => "reservation.show",
            "edit" => "reservation.edit",
            "update" => "reservation.update",
        ])
        ->middleware("role:manager,employee");

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
