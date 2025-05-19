<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\DepartmentRequest;
use Inertia\Inertia;
use App\Models\Department;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

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
        $department = Department::create($request->validated());

        Log::channel('project')->info('Department created', [
            'user_id' => Auth::user()->id,
            'table' => 'departments',
            'record_id' => $department->id,
        ]);

        return redirect()->route('department.index')->with('success', 'Departemen berhasil ditambahkan');
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
            $department = Department::findOrFail($id);

            return Inertia::render('department/edit', [
                'department' => $department,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('warning', 'Departemen tidak ditemukan');
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

            Log::channel('project')->info('Department updated', [
                'user_id' => Auth::user()->id,
                'table' => 'departments',
                'record_id' => $department->id,
            ]);

            return redirect()->route('department.index')->with('success', 'Departemen berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            return back()->with('warning', 'Departemen tidak ditemukan');
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

            Log::channel('project')->info('Department deleted', [
                'user_id' => Auth::user()->id,
                'table' => 'departments',
                'record_id' => $department->id,
            ]);

            $department->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('warning', 'Departemen tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
