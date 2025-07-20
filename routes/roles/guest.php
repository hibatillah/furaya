<?php

use App\Http\Controllers\Publics\PublicReservationController;
use App\Http\Controllers\Reservations\PaymentController;
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

Route::middleware(["auth", "role:guest"])->group(function () {
  // show reservation history
  Route::get("/reservasi/riwayat", [
    PublicReservationController::class,
    "history"
  ])->name("public.reservation.history");

  // store reservation
  Route::post("/reservasi/tambah", [
    PublicReservationController::class,
    "store"
  ])->name("public.reservation.store");

  // update payment status
  Route::put("/reservasi/pembayaran/{id}", [
    PublicReservationController::class,
    "payment"
  ])->name("public.reservation.payment");

  // update reservation payment detail
  Route::put("/reservasi/pembayaran/{id}", [
    PublicReservationController::class,
    "payment"
  ])->name("public.reservation.payment");

  // get payment snap token
  Route::post("/reservasi/snap-token", [
    PaymentController::class,
    "getSnapToken"
  ])->name("public.reservation.snap-token");
});
