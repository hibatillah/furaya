<?php

use App\Http\Controllers\Reservations\CheckInController;
use App\Http\Controllers\Reservations\CheckOutController;
use Illuminate\Support\Facades\Route;

Route::middleware(["auth", "verified", "role:employee"])->group(function () {
  /** check in routes */
  Route::get("check-in/tambah", [CheckInController::class, "create"])->name("checkin.create");
  Route::resource("check-in", CheckInController::class)
    ->except(["create", "destroy"])
    ->parameters(["check-in" => "id"])
    ->names([
      "index" => "checkin.index",
      "store" => "checkin.store",
      "show" => "checkin.show",
      "edit" => "checkin.edit",
      "update" => "checkin.update",
    ]);

  /** check out routes */
  Route::get("check-out/tambah", [CheckOutController::class, "create"])->name("checkout.create");
  Route::resource("check-out", CheckOutController::class)
    ->except(["create", "destroy"])
    ->parameters(["check-out" => "id"])
    ->names([
      "index" => "checkout.index",
      "store" => "checkout.store",
      "show" => "checkout.show",
      "edit" => "checkout.edit",
      "update" => "checkout.update",
    ]);
});
