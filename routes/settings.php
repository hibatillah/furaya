<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Publics\ProfileController as PublicProfileController;
use App\Http\Controllers\Publics\PasswordController as PublicPasswordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::prefix('admin')->group(function () {
        Route::redirect('settings', 'settings/profile');

        // admin profile routes
        Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // admin password routes
        Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
        Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

        // appearance routes
        Route::get('settings/appearance', function () {
            return Inertia::render('settings/appearance');
        })->name('appearance');
    });

    // guest profile routes
    Route::get('settings/profile', [PublicProfileController::class, 'edit'])->name('public.profile.edit');
    Route::patch('settings/profile', [PublicProfileController::class, 'update'])->name('public.profile.update');
    Route::delete('settings/profile', [PublicProfileController::class, 'destroy'])->name('public.profile.destroy');

    // guest password routes
    Route::get('settings/password', [PublicPasswordController::class, 'edit'])->name('public.password.edit');
    Route::put('settings/password', [PublicPasswordController::class, 'update'])->name('public.password.update');
});
