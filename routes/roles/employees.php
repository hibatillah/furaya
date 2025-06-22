<?php

use App\Http\Controllers\Reservations\CheckInController;
use App\Http\Controllers\Reservations\CheckOutController;
use Illuminate\Support\Facades\Route;

Route::middleware("role:employee")->group(function () {
  /** check in routes */
  Route::resource("check-in", CheckInController::class)
    ->only(["index", "store"])
    ->parameters(["check-in" => "id"])
    ->names([
      "index" => "checkin.index",
      "store" => "checkin.store",
    ]);

  /** check out routes */
  Route::post("check-out", [CheckOutController::class, "store"])->name("checkout.store");
});
