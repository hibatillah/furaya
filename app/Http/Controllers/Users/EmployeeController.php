<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\EmployeeRequest;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = User::withWhereHas("role", function ($query) {
            $query->where("name", "ILIKE", "employee");    // case-insensitive for pgsql
        })->orderBy('created_at', 'desc')->get();

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
        $employee = Employee::create($request->validated());

        Log::channel('project')->info('Employee created', [
            'user_id' => Auth::user()->id,
            'table' => 'employees',
            'record_id' => $employee->id,
        ]);

        return redirect()->route('employee.index')->with('success', 'Karyawan berhasil ditambahkan');
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
            $employee = Employee::with('user', 'department')->findOrFail($id);

            return Inertia::render('employee/edit', [
                'employee' => $employee,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Employee not found", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
            ]);

            return back()->with('warning', 'Karyawan tidak ditemukan');
        } catch (\Exception $e) {
            Log::channel("project")->error("Showing edit employee page", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
            ]);

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

            Log::channel('project')->info('Employee updated', [
                'user_id' => Auth::user()->id,
                'table' => 'employees',
                'record_id' => $employee->id,
            ]);

            return redirect()->route('employee.index')->with('success', 'Karyawan berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Employee not found", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
            ]);

            return back()->with('warning', 'Karyawan tidak ditemukan');
        } catch (\Exception $e) {
            Log::channel("project")->error("Updating employee", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
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
            $employee = Employee::findOrFail($id);

            Log::channel('project')->info('Employee deleted', [
                'user_id' => Auth::user()->id,
                'table' => 'employees',
                'record_id' => $employee->id,
            ]);

            $employee->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Employee not found", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
            ]);

            return redirect()->back()->with('warning', 'Karyawan tidak ditemukan');
        } catch (\Exception $e) {
            Log::channel("project")->error("Deleting employee", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
            ]);

            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
