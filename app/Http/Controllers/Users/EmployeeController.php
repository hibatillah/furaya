<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\EmployeeRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Employee;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = Employee::with('user', 'department')->orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('employee/index', [
            'employees' => $employees,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('employee/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EmployeeRequest $request)
    {
        Employee::create($request->validated());
        return redirect()->route('employee.index')->with('success', 'Karyawan berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $employee = Employee::with('user', 'department')->findOrFail($id);
            return Inertia::render('employee/show', [
                'employee' => $employee,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Karyawan tidak ditemukan');
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
            $employee = Employee::with('user', 'department')->findOrFail($id);
            return Inertia::render('employee/edit', [
                'employee' => $employee,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Karyawan tidak ditemukan');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EmployeeRequest $request, string $id)
    {
        try {
            $employee = Employee::findOrFail($id);
            $employee->update($request->validated());
            return redirect()->route('employee.show', ['id' => $id])
                ->with('success', 'Karyawan berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            return back()->with('error', 'Karyawan tidak ditemukan');
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
            $employee = Employee::findOrFail($id);
            $employee->delete();
            return redirect()->back()->with('success', 'Karyawan berhasil dihapus.');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('warning', 'Karyawan tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
