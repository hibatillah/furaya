<?php

namespace App\Http\Controllers\Managements;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Managements\EmployeeRequest;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Managements\Employee;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Managements\Department;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departments = Department::all();
        $employees = Employee::with("user", "department")
            ->whereHas("user", function ($query) {
                $query->where("role", RoleEnum::EMPLOYEE);
            })
            ->latest()
            ->get();

        return Inertia::render('employee/index', [
            'employees' => $employees,
            'departments' => $departments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::all();

        return Inertia::render('employee/create', [
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EmployeeRequest $request)
    {
        try {
            $validated = $request->validated();

            $employee = Arr::except($validated, ["name", "email", "password"]);
            $userData = Arr::only($validated, ["name", "email", "password"]);
            $userData["password"] = Hash::make($userData["password"]);
            $userData["role"] = RoleEnum::EMPLOYEE;

            DB::transaction(function () use ($userData, $employee) {
                // create user
                $user = User::create($userData);

                // create employee
                $user->employee()->create($employee);
            });

            return redirect()->route('employee.index')
                ->with('success', 'Karyawan berhasil dibuat');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
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
            $employee = Employee::with('user', 'department')
                ->findOrFail($id);
            $departments = Department::all();

            return Inertia::render('employee/edit', [
                'employee' => $employee,
                'departments' => $departments,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Data karyawan tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EmployeeRequest $request, string $id)
    {
        try {
            $employee = Employee::findOrFail($id);

            $validated = $request->validated();
            $employeeData = Arr::except($validated, ["name", "email"]);
            $userData = Arr::only($validated, ["name", "email"]);

            // update user and employee
            DB::transaction(function () use ($employee, $employeeData, $userData) {
                $employee->user->update($userData);
                $employee->update($employeeData);
            });

            return redirect()->route('employee.index')->with('success', 'Karyawan berhasil diperbarui');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Data karyawan tidak ditemukan'
            ]);
        } catch (\Exception $e) {
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
            $employee = Employee::findOrFail($id);
            $employee->user->delete(); // delete user cascade to employee

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Data karyawan tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }
}
