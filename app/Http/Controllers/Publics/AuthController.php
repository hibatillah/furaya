<?php

namespace App\Http\Controllers\Publics;

use App\Http\Controllers\Controller;
use App\Models\Guests\Guest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'phone' => 'required_without:email|string|max:15',
            'email' => 'required_without:phone|string|email',
            'password' => 'required|string',
        ]);

        if ($request->filled('email')) {
            $user = User::where('email', $request->email)->first();

            if (
                !$user
                || !Hash::check($request->password, $user->password)
                || $user->role !== "guest"
            ) {
                throw ValidationException::withMessages([
                    'email' => ['Email atau password salah.'],
                ]);
            }
        } else {
            $guest = Guest::with('user')->where('phone', $request->phone)->first();

            if (!$guest || !Hash::check($request->password, $guest->user->password)) {
                throw ValidationException::withMessages([
                    'phone' => ['Nomor telepon atau password salah.'],
                ]);
            }

            $user = $guest->user;
        }

        Auth::login($user);
        $request->session()->regenerate();

        return back()->with('username', $user->name);
    }


    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15|unique:guests',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => "guest",
        ]);

        $user->guest()->create([
            'phone' => $validated['phone'],
        ]);

        event(new Registered($user));

        Auth::login($user);

        return back();
    }
}
