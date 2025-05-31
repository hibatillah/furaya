<?php

namespace App\Http\Controllers\Roles;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\EmployeeRequest;
use App\Http\Requests\Roles\UserRequest;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Department;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
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
        $employees = Employee::with("user", "department")->whereHas("user", function ($query) {
            $query->where("role", RoleEnum::EMPLOYEE);
        })->orderBy("created_at", "desc")->get();
        $departments = Department::all();

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
    public function store(Request $request)
    {
        try {
            $result = DB::transaction(function () use ($request) {
                // set user data
                $request["password"] = Hash::make($request["password"]);
                $request["role"] = RoleEnum::EMPLOYEE;

                // validate request
                $validatedUser = $this->validateUser($request);

                // create user
                $user = User::create($validatedUser);

                // set employee data
                $request["user_id"] = $user->id;

                // validate employee request
                $validatedEmployee = $this->validateEmployee($request);

                // create data
                $employee = Employee::create($validatedEmployee);

                return ['user' => $user, 'employee' => $employee];
            });

            Log::channel('project')->info('Employee created', [
                'user_id' => Auth::user()->id,
                'table' => 'employees',
                'record_id' => $result['employee']->id,
            ]);

            return redirect()->route('employee.index')->with('success', 'Karyawan berhasil dibuat');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::channel("project")->error("Creating employee", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
            ]);

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
            $employee = Employee::with('user', 'department')->findOrFail($id);
            $departments = Department::all();

            return Inertia::render('employee/edit', [
                'employee' => $employee,
                'departments' => $departments,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Employee not found", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
            ]);

            return back()->withErrors([
                'message' => 'Data karyawan tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Showing edit employee page", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
            ]);

            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $employee = Employee::findOrFail($id);

            // validate request
            $validated = (object) [
                "user" => $this->validateUser($request, $employee->user_id),
                "employee" => $this->validateEmployee($request),
            ];

            // Update user and employee data
            DB::transaction(function () use ($employee, $validated) {
                $employee->user->update($validated->user);
                $employee->update($validated->employee);
            });

            // Log the update
            Log::channel('project')->info('Employee updated', [
                'user_id' => Auth::user()->id,
                'table' => 'employees',
                'record_id' => $employee->id,
            ]);

            return redirect()->route('employee.index')->with('success', 'Karyawan berhasil diperbarui');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Employee not found", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
            ]);

            return back()->withErrors([
                'message' => 'Data karyawan tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Updating employee", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
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

            Log::channel('project')->info('Employee deleted', [
                'user_id' => Auth::user()->id,
                'table' => 'employees',
                'record_id' => $user->id,
            ]);

            // delete user cascade to employee
            $user->delete();

            // handle message in frontend
            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Employee not found", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
            ]);

            return back()->withErrors([
                'message' => 'Data karyawan tidak ditemukan'
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Deleting employee", [
                "user_id" => Auth::user()->id,
                "table" => "employees",
            ]);

            return back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }

    private function validateEmployee(Request $request)
    {
        $employeeRequest = new EmployeeRequest();
        $employeeRules = $employeeRequest->rules();

        $validated = Validator::make($request->only(array_keys($employeeRules)), $employeeRules)->validate();

        return $validated;
    }
}
