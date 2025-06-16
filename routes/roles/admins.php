<?php

use App\Http\Controllers\Guests\CountryController;
use App\Http\Controllers\Guests\GeographyController;
use App\Http\Controllers\Guests\GuestController;
use App\Http\Controllers\Guests\NationalityController;
use App\Http\Controllers\Reservations\GuestTypeController;
use App\Http\Controllers\Rooms\RateTypeController;
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
    Route::get("kamar/tambah", [RoomTypeController::class, "create"])->name("roomtype.create");
    Route::resource("kamar", RoomTypeController::class)
      ->except(["create"])
      ->parameters(["kamar" => "id"])
      ->names([
        "index" => "roomtype.index",
        "store" => "roomtype.store",
        "show" => "roomtype.show",
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

    /**
     * rate type routes
     * `/tipe/tarif`
     */
    Route::resource("tarif", RateTypeController::class)
      ->except(["create", "show"])
      ->parameters(["tarif" => "id"])
      ->names([
        "index" => "rate.type.index",
        "store" => "rate.type.store",
        "edit" => "rate.type.edit",
        "update" => "rate.type.update",
        "destroy" => "rate.type.destroy",
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

  /** nationality resource routes */
  Route::resource("kewarganegaraan", NationalityController::class)
    ->except(["create", "show", "edit"])
    ->parameters(["kewarganegaraan" => "id"])
    ->names([
      "index" => "nationality.index",
      "store" => "nationality.store",
      "update" => "nationality.update",
      "destroy" => "nationality.destroy",
    ]);

  /** country resource routes */
  Route::resource("negara", CountryController::class)
    ->except(["create", "show", "edit"])
    ->parameters(["negara" => "id"])
    ->names([
      "index" => "country.index",
      "store" => "country.store",
      "update" => "country.update",
      "destroy" => "country.destroy",
    ]);

  /** geography resource routes */
  Route::resource("geografi", GeographyController::class)
    ->except(["create", "show", "edit"])
    ->parameters(["geografi" => "id"])
    ->names([
      "index" => "geography.index",
      "store" => "geography.store",
      "update" => "geography.update",
      "destroy" => "geography.destroy",
    ]);

  /** guest_type resource routes */
  Route::resource("tipe-tamu", GuestTypeController::class)
    ->except(["create", "show", "edit"])
    ->parameters(["tipe-tamu" => "id"])
    ->names([
      "index" => "guest.type.index",
      "store" => "guest.type.store",
      "update" => "guest.type.update",
      "destroy" => "guest.type.destroy",
    ]);
});
