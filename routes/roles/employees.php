<?php

use App\Http\Controllers\Reservations\CheckInController;
use App\Http\Controllers\Reservations\CheckOutController;
use App\Http\Controllers\Reservations\ReservationController;
use Illuminate\Support\Facades\Route;

Route::middleware("role:employee")->group(function () {
  /** reservation routes */
  Route::resource("reservasi", ReservationController::class)
    ->only(["store", "edit", "update"])
    ->parameters(["reservasi" => "id"])
    ->names([
      "store" => "reservation.store",
      "edit" => "reservation.edit",
      "update" => "reservation.update",
    ]);

  /** check in routes */
  Route::resource("check-in", CheckInController::class)
    ->only(["index", "store", "update"])
    ->parameters(["check-in" => "id"])
    ->names([
      "index" => "checkin.index",
      "store" => "checkin.store",
      "update" => "checkin.update",
    ]);

  /** check out routes */
  Route::resource("check-out", CheckOutController::class)
    ->only(["store", "update"])
    ->parameters(["check-out" => "id"])
    ->names([
      "store" => "checkout.store",
      "update" => "checkout.update",
    ]);
});
