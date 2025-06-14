<?php

use App\Http\Controllers\DashboardController;
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
    Route::get("reservasi/tambah", [ReservationController::class, "create"])
        ->name("reservation.create")
        ->middleware("role:employee");

    // add other reservation routes for managers and employees
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
