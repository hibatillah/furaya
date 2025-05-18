<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\DepartmentRequest;
use Inertia\Inertia;
use App\Models\Department;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departments = Department::orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('department/index', [
            'departments' => $departments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('department/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DepartmentRequest $request)
    {
        Department::create($request->validated());
        return redirect()->route('department.index')->with('success', 'Departemen berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $department = Department::findOrFail($id);
            return Inertia::render('department/show', [
                'department' => $department,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Departemen tidak ditemukan');
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
            $department = Department::findOrFail($id);
            return Inertia::render('department/edit', [
                'department' => $department,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Departemen tidak ditemukan');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DepartmentRequest $request, string $id)
    {
        try {
            $department = Department::findOrFail($id);
            $department->update($request->validated());
            return redirect()->route('department.show', ['id' => $id])
                ->with('success', 'Departemen berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Departemen tidak ditemukan');
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
            $department = Department::findOrFail($id);
            $department->delete();
            return redirect()->back()->with('success', 'Departemen berhasil dihapus.');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('warning', 'Departemen tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
