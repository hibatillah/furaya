<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class HandleUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $userRole = Auth::user()?->role;
        $authorized = in_array($userRole, $roles);

        if (!$authorized) {
            Log::channel("project")->warning("Unauthorized access", [
                "url"     => request()->fullUrl(),
                "role"    => $userRole,
                "roles"   => $roles,
                "user_id" => Auth::user()?->id ?? null,
                "env"     => config('app.env'),
                "time"    => now()->toDateTimeString(),
            ]);

            return Inertia::render('not-found')
                ->toResponse($request)
                ->setStatusCode(404);
        }

        return $next($request);
    }
}
