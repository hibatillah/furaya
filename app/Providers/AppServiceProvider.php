<?php

namespace App\Providers;

use Inertia\Inertia;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment("production")) {
            URL::forceScheme("https");
        }

        Inertia::share([
            'appUrl' => env('APP_URL'),
        ]);
    }
}
