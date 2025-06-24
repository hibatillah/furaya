<?php

use App\Http\Controllers\Publics\PublicReservationController;
use Illuminate\Support\Facades\Route;

// show available room for reservation
Route::get("/reservasi", [
  PublicReservationController::class,
  "index"
])->name("public.reservation");

// show room detail for reservation
Route::get("/reservasi/kamar", [
  PublicReservationController::class,
  "room"
])
  ->name("public.reservation.room");

// show form for reservation
Route::get("/reservasi/tambah", [
  PublicReservationController::class,
  "create"
])->name("public.reservation.create");

// store reservation
Route::post("/reservasi/tambah", [
  PublicReservationController::class,
  "store"
])->name("public.reservation.store");
