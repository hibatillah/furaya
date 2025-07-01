<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            return redirect()->route('dashboard')->with('warning', 'Anda tidak memiliki akses');
        }

        return $next($request);
    }
}
