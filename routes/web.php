<?php

use App\Http\Controllers\Rooms\RoomController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\Users\RoleController;
use App\Http\Controllers\Users\ManagerController;
use App\Http\Controllers\Users\EmployeeController;
use App\Http\Controllers\Users\DepartmentController;
use App\Http\Controllers\Users\CustomerController;
use App\Http\Controllers\Users\AdminController;
use App\Http\Controllers\Rooms\RoomTypeController;
use App\Http\Controllers\Rooms\BedTypeController;
use App\Http\Controllers\Reservations\ReservationController;
use App\Http\Controllers\Rooms\RoomStatusController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // ======================= access by admin and manager ======================= //
    Route::middleware("role:admin,manager")->group(function () {
        /**
         * user resource routes
         */
        Route::get("user/tambah", [UserController::class, "create"])->name("user.create");
        Route::resource("user", UserController::class)
            ->except(["create", "show"])
            ->parameters(["user" => "id"])
            ->names([
                "index" => "user.index",
                "store" => "user.store",
                "edit" => "user.edit",
                "update" => "user.update",
                "destroy" => "user.destroy",
            ]);
    });


    // ======================= access by manager ======================= //
    Route::middleware("role:manager")->group(function () {
        /**
         * role resource routes
         */
        Route::get("role/tambah", [RoleController::class, "create"])->name("role.create");
        Route::resource("role", RoleController::class)
            ->except(["create"])
            ->parameters(["role" => "id"])
            ->names([
                "index" => "role.index",
                "store" => "role.store",
                "edit" => "role.edit",
                "update" => "role.update",
                "destroy" => "role.destroy",
            ]);

        /**
         * admin resource routes
         */
        Route::get("admin/tambah", [AdminController::class, "create"])->name("admin.create");
        Route::resource("admin", AdminController::class)
            ->except(["create", "show"])
            ->parameters(["admin" => "id"])
            ->names([
                "index" => "admin.index",
                "store" => "admin.store",
                "edit" => "admin.edit",
                "update" => "admin.update",
                "destroy" => "admin.destroy",
            ]);

        /**
         * employee resource routes
         */
        Route::get("karyawan/tambah", [EmployeeController::class, "create"])->name("employee.create");
        Route::resource("karyawan", EmployeeController::class)
            ->except(["create"])
            ->parameters(["employee" => "id"])
            ->names([
                "index" => "employee.index",
                "store" => "employee.store",
                "show" => "employee.show",
                "edit" => "employee.edit",
                "update" => "employee.update",
                "destroy" => "employee.destroy",
            ]);

        /**
         * department resource routes
         */
        Route::get("departemen/tambah", [DepartmentController::class, "create"])->name("department.create");
        Route::resource("departemen", DepartmentController::class)
            ->except(["create", "show"])
            ->parameters(["department" => "id"])
            ->names([
                "index" => "department.index",
                "store" => "department.store",
                "edit" => "department.edit",
                "update" => "department.update",
                "destroy" => "department.destroy",
            ]);
    });

    // ======================= access by admin ======================= //
    Route::middleware("role:admin")->group(function () {
        /**
         * room routes
         * `/kamar`
         */
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
            Route::get("kasur/tambah", [BedTypeController::class, "create"])->name("bedtype.create");
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
    });

    // ======================= access by employee ======================= //
    Route::middleware("role:employee")->group(function () {
        /**
         * room status routes
         * `/status/kamar`
         */
        Route::resource("status/kamar", RoomStatusController::class)
            ->except(["create", "store", "show", "destroy"])
            ->parameters(["status/kamar" => "id"])
            ->names([
                "index" => "roomstatus.index",
                "edit" => "roomstatus.edit",
                "update" => "roomstatus.update",
            ]);

        /**
         * reservation resource routes
         */
        Route::get("reservasi/tambah", [ReservationController::class, "create"])->name("reservation.create");
        Route::resource("reservasi", ReservationController::class)
            ->except(["create"])
            ->parameters(["reservasi" => "id"])
            ->names([
                "index" => "reservation.index",
                "store" => "reservation.store",
                "show" => "reservation.show",
                "edit" => "reservation.edit",
                "update" => "reservation.update",
                "destroy" => "reservation.destroy",
            ]);
    });

    /**
     * customer resource routes
     */
    Route::get("customer/tambah", [CustomerController::class, "create"])->name("customer.create");
    Route::resource("customer", CustomerController::class)
        ->except(["create"])
        ->parameters(["customer" => "id"])
        ->names([
            "index" => "customer.index",
            "store" => "customer.store",
            "show" => "customer.show",
            "edit" => "customer.edit",
            "update" => "customer.update",
            "destroy" => "customer.destroy",
        ]);

    // IMPORTANT: This fallback route MUST be the very last route
    Route::fallback(function () {
        return Inertia::render('not-found');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
