<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\HandleUserRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => HandleUserRole::class,
        ]);

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Throwable $e) {
            // custom exception logging
            Log::channel("project")->error("Exception", [
                "url"     => request()->fullUrl(),
                "message" => $e->getMessage(),
                "file"    => $e->getFile(),
                "line"    => $e->getLine(),
                "user_id" => Auth::user()?->id ?? null,
                "env"     => config('app.env'),
                "time"    => now()->toDateTimeString(),
            ]);
        });

        $exceptions->render(function (Throwable $e, Request $request) {
            // Check if it's an Inertia request
            if ($request->header('X-Inertia')) {
                $status = 500; // Default status for generic errors

                // Determine the correct HTTP status code if it's an HTTP exception
                if ($e instanceof HttpException) {
                    $status = $e->getStatusCode();
                }

                // Render your Inertia 404/Error component
                // (e.g., resources/js/Pages/Errors/404.jsx)
                if ($status === 404) {
                    return Inertia::render('not-found')
                        ->toResponse($request)
                        ->setStatusCode($status);
                }

                // custom error page for production
                if (config('app.env') === 'production') {
                    return Inertia::render('error', [
                        'status' => $status,
                        'message' => $e->getMessage(),
                    ])
                        ->toResponse($request)
                        ->setStatusCode($status);
                }
            }

            // Return null to let Laravel's default exception handler take over.
            return null;
        });
    })->create();
