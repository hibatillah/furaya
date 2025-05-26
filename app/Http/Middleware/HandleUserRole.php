<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
        $user = Auth::user();
        $userRole = strtolower($user->role?->name) ?? "customer";
        $authorized = in_array($userRole, $roles);

        // Log::channel('project')->debug("check user role", [
        //     'user_role' => $userRole,
        //     'authorized' => $authorized,
        // ]);

        if (!$authorized) {
            return redirect()->route('dashboard')->with('warning', 'Anda tidak memiliki akses');
        }

        return $next($request);
    }
}
