<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\AdminRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Admin;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
        Admin::create($request->validated());
        return redirect()->route('admin.index')->with('success', 'Admin berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $admin = Admin::with('user')->findOrFail($id);
            return Inertia::render('admin/show', [
                'admin' => $admin,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Admin tidak ditemukan');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

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
            return back()->with('error', 'Admin tidak ditemukan');
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
            return redirect()->route('admin.show', ['id' => $id])
                ->with('success', 'Admin berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Admin tidak ditemukan');
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
            $admin->delete();
            return redirect()->back()->with('success', 'Admin berhasil dihapus.');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('warning', 'Admin tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
