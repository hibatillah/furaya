<?php

use App\Http\Controllers\Rooms\RoomController;
use App\Http\Controllers\Rooms\RoomTypeController;
use App\Http\Controllers\Rooms\BedTypeController;
use App\Http\Controllers\Rooms\FacilityController;
use Illuminate\Support\Facades\Route;

Route::middleware(["auth", "verified", "role:admin"])->group(function () {
  /** room resource routes */
  Route::get("kamar/tambah", [RoomController::class, "create"])->name("room.create");
  Route::resource("/kamar", RoomController::class)
    ->except(["create"])
    ->parameters(["kamar" => "id"])
    ->names([
      "index" => "room.index",
      "store" => "room.store",
      "show" => "room.show",
      "edit" => "room.edit",
      "update" => "room.update",
      "destroy" => "room.destroy",
    ]);

  // add prefix "/tipe"
  Route::prefix("tipe")->group(function () {
    /**
     * room type routes
     * `/tipe/kamar`
     */
    Route::resource("kamar", RoomTypeController::class)
      ->except(["create", "show"])
      ->parameters(["kamar" => "id"])
      ->names([
        "index" => "roomtype.index",
        "store" => "roomtype.store",
        "edit" => "roomtype.edit",
        "update" => "roomtype.update",
        "destroy" => "roomtype.destroy",
      ]);

    /**
     * bed type routes
     * `/tipe/kasur`
     */
    Route::resource("kasur", BedTypeController::class)
      ->except(["create", "show"])
      ->parameters(["kasur" => "id"])
      ->names([
        "index" => "bedtype.index",
        "store" => "bedtype.store",
        "edit" => "bedtype.edit",
        "update" => "bedtype.update",
        "destroy" => "bedtype.destroy",
      ]);
  });

  /** facility for room routes */
  Route::resource("/fasilitas", FacilityController::class)
    ->except(["create", "show"])
    ->parameters(["fasilitas" => "id"])
    ->names([
      "index" => "facility.index",
      "store" => "facility.store",
      "edit" => "facility.edit",
      "update" => "facility.update",
      "destroy" => "facility.destroy",
    ]);
});
