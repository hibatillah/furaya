<?php

namespace App\Http\Controllers\Roles;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\UserRequest;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        $roles = RoleEnum::getValues();

        return Inertia::render('user/index', [
            'users' => $users,
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
    public function store(UserRequest $request) {}

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
    public function update(UserRequest $request, string $id)
    {
        try {
            $user = User::findOrFail($id);

            $user->update($request->validated());
            $user->refresh();

            $method = Request::getMethod();

            Log::channel('project')->info('User updated', [
                'user_id' => Auth::user()->id,
                'table' => 'users',
                'record_id' => $user->id,
                'method' => $method,
            ]);

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("User not found", [
                "user_id" => Auth::user()->id,
                "table" => "users",
            ]);

            return back()->withErrors([
                'message' => 'User tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Updating user", [
                "user_id" => Auth::user()->id,
                "table" => "users",
            ]);

            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);

            Log::channel('project')->info('User deleted', [
                'user_id' => Auth::user()->id,
                'table' => 'users',
                'record_id' => $user->id,
            ]);

            $user->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("User not found", [
                "user_id" => Auth::user()->id,
                "table" => "users",
            ]);

            return back()->withErrors([
                'message' => 'User tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Deleting user", [
                "user_id" => Auth::user()->id,
                "table" => "users",
            ]);

            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }
}
