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
        $admins = User::whereIn("role", [RoleEnum::ADMIN, RoleEnum::MANAGER])
            ->latest()
            ->get();

        return Inertia::render('admin/index', [
            'admins' => $admins,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store() {}

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id) {}

    /**
     * Update the specified resource in storage.
     */
    public function update() {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {}
}
