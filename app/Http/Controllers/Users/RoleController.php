<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\RoleRequest;
use Inertia\Inertia;
use App\Models\Role;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::orderBy('created_at', 'desc')->get();

        return Inertia::render('role/index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        $role = Role::create($request->validated());

        Log::channel('project')->info('Role created', [
            'user_id' => Auth::user()->id,
            'table' => 'roles',
            'record_id' => $role->id,
        ]);

        return redirect()->back();
    }

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
    public function update(RoleRequest $request, string $id)
    {
        try {
            $role = Role::findOrFail($id);
            $role->update($request->validated());

            Log::channel('project')->info('Role updated', [
                'user_id' => Auth::user()->id,
                'table' => 'roles',
                'record_id' => $role->id,
            ]);

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Role not found", [
                "user_id" => Auth::user()->id,
                "table" => "roles",
            ]);

            return back()->with('warning', 'Role tidak ditemukan');
        } catch (\Exception $e) {
            Log::channel("project")->error("Updating role", [
                "user_id" => Auth::user()->id,
                "table" => "roles",
            ]);

            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $role = Role::findOrFail($id);

            Log::channel('project')->info('Role deleted', [
                'user_id' => Auth::user()->id,
                'table' => 'roles',
                'record_id' => $role->id,
            ]);

            $role->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Role not found", [
                "user_id" => Auth::user()->id,
                "table" => "roles",
            ]);

            return redirect()->back()->with('warning', 'Role tidak ditemukan');
        } catch (\Exception $e) {
            Log::channel("project")->error("Deleting role", [
                "user_id" => Auth::user()->id,
                "table" => "roles",
            ]);

            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
