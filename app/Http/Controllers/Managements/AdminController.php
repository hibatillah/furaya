<?php

namespace App\Http\Controllers\Managements;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\User;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $admins = User::whereIn("role", [RoleEnum::ADMIN, RoleEnum::MANAGER])
                ->latest()
                ->get();

            return Inertia::render('admin/index', [
                'admins' => $admins,
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menampilkan data admin.",
            ]);
        }
    }
}
