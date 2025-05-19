<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserRequest;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('user/index', [
            'users' => $users,
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
            return back()->with('warning', 'User tidak ditemukan');
        } catch (\Exception $e) {
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
            $user->update($request->validated());

            Log::channel('project')->info('User updated', [
                'user_id' => Auth::user()->id,
                'table' => 'users',
                'record_id' => $user->id,
            ]);

            return redirect()->route('user.show', ['id' => $id])->with('success', 'User berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            return back()->with('warning', 'User tidak ditemukan');
        } catch (\Exception $e) {
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
            return redirect()->back()->with('warning', 'User tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
