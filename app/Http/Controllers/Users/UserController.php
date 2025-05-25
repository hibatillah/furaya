<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserRequest;
use App\Models\Role;
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
        $roles = Role::all();
        $users = User::with('role')
            // ->whereNot('id', 1)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('user/index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('user/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $user = User::create($request->validated());

        Log::channel('project')->info('User created', [
            'user_id' => Auth::user()->id,
            'table' => 'users',
            'record_id' => $user->id,
        ]);

        return redirect()->route('user.index')->with('success', 'User berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $user = User::findOrFail($id);

            return Inertia::render('user/edit', [
                'user' => $user,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("User not found", [
                "user_id" => Auth::user()->id,
                "table" => "users",
            ]);

            return back()->with('warning', 'User tidak ditemukan');
        } catch (\Exception $e) {
            Log::channel("project")->error("Showing edit user page", [
                "user_id" => Auth::user()->id,
                "table" => "users",
            ]);

            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, string $id)
    {
        try {
            $user = User::findOrFail($id);


            Log::channel('project')->debug('Before:', ['role_id' => $user->role_id]);

            $user->update($request->validated());

            $user->refresh();
            Log::channel('project')->debug('After:', ['role_id' => $user->role_id]);

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

            return back()->with('warning', 'User tidak ditemukan');
        } catch (\Exception $e) {
            Log::channel("project")->error("Updating user", [
                "user_id" => Auth::user()->id,
                "table" => "users",
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

            return redirect()->back()->with('warning', 'User tidak ditemukan');
        } catch (\Exception $e) {
            Log::channel("project")->error("Deleting user", [
                "user_id" => Auth::user()->id,
                "table" => "users",
            ]);

            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
