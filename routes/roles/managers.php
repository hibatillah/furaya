<?php

use App\Http\Controllers\Guests\GuestController;
use App\Http\Controllers\Managements\DepartmentController;
use App\Http\Controllers\Managements\EmployeeController;
use App\Http\Controllers\Managements\AdminController;
use App\Http\Controllers\Managements\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(["auth", "verified", "role:manager"])->group(function () {
    /** user resource routes */
    Route::resource("user", UserController::class)
        ->only(["index", "update", "destroy"])
        ->names([
            "index" => "user.index",
            "update" => "user.update",
            "destroy" => "user.destroy",
        ]);

    /** admin resource routes */
    Route::resource("admin", AdminController::class)
        ->only(["index", "update", "destroy"])
        ->names([
            "index" => "admin.index",
            "update" => "admin.update",
            "destroy" => "admin.destroy",
        ]);

    /** employee resource routes */
    Route::get("karyawan/tambah", [EmployeeController::class, "create"])->name("employee.create");
    Route::resource("karyawan", EmployeeController::class)
        ->except(["create", "show"])
        ->parameters(["karyawan" => "id"])
        ->names([
            "index" => "employee.index",
            "store" => "employee.store",
            "edit" => "employee.edit",
            "update" => "employee.update",
            "destroy" => "employee.destroy",
        ]);

    /** department resource routes */
    Route::resource("departemen", DepartmentController::class)
        ->except(["create", "show", "edit"])
        ->parameters(["departemen" => "id"])
        ->names([
            "index" => "department.index",
            "store" => "department.store",
            "update" => "department.update",
            "destroy" => "department.destroy",
        ]);
});
