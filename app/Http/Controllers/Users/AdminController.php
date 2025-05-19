<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\AdminRequest;
use Inertia\Inertia;
use App\Models\Admin;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admins = Admin::with('user')->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/index', [
            'admins' => $admins,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AdminRequest $request)
    {
        $admin = Admin::create($request->validated());

        Log::channel('project')->info('Admin created', [
            'user_id' => Auth::user()->id,
            'table' => 'admins',
            'record_id' => $admin->id,
        ]);

        return redirect()->route('admin.index')->with('success', 'Admin berhasil ditambahkan');
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
            $admin = Admin::with('user')->findOrFail($id);

            return Inertia::render('admin/edit', [
                'admin' => $admin,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('warning', 'Admin tidak ditemukan');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AdminRequest $request, string $id)
    {
        try {
            $admin = Admin::findOrFail($id);
            $admin->update($request->validated());

            Log::channel('project')->info('Admin updated', [
                'user_id' => Auth::user()->id,
                'table' => 'admins',
                'record_id' => $admin->id,
            ]);

            return redirect()->route('admin.index')->with('success', 'Admin berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            return back()->with('warning', 'Admin tidak ditemukan');
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
            $admin = Admin::findOrFail($id);

            Log::channel('project')->info('Admin deleted', [
                'user_id' => Auth::user()->id,
                'table' => 'admins',
                'record_id' => $admin->id,
            ]);

            $admin->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('warning', 'Admin tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
