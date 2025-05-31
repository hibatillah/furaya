<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\CustomerRequest;
use App\Models\Reservation;
use Inertia\Inertia;
use App\Models\Customer;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::with('user')->orderBy('created_at', 'desc')->get();

        return Inertia::render('customer/index', [
            'customers' => $customers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(CustomerRequest $request)
    {
        try {
            $customer = Customer::create($request->validated());

            Log::channel('project')->info('Customer created', [
                'user_id' => Auth::user()->id,
                'table' => 'customers',
                'record_id' => $customer->id,
            ]);

            return redirect()->route('customer.index')->with('success', 'Customer berhasil ditambahkan');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::channel("project")->error("Creating customer", [
                "user_id" => Auth::user()->id,
                "table" => "customers",
            ]);

            return back()->withErrors([
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $customer = Customer::with('user')->findOrFail($id);
            $reservations = Reservation::with('room', 'employee')->where('customer_id', $id)->get();

            return Inertia::render('customer/show', [
                'customer' => $customer,
                'reservations' => $reservations,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Customer not found", [
                "user_id" => Auth::user()->id,
                "table" => "customers",
            ]);

            return back()->withErrors([
                'message' => 'Customer tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Showing customer", [
                "user_id" => Auth::user()->id,
                "table" => "customers",
            ]);

            return back()->withErrors([
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $customer = Customer::with('user')->findOrFail($id);

            return Inertia::render('customer/edit', [
                'customer' => $customer,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Customer not found", [
                "user_id" => Auth::user()->id,
                "table" => "customers",
            ]);

            return back()->withErrors([
                'message' => 'Customer tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Showing edit customer page", [
                "user_id" => Auth::user()->id,
                "table" => "customers",
            ]);

            return back()->withErrors([
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $customer = Customer::with('user')->findOrFail($id);

            Log::channel('project')->info('Update 1', [
                'table' => 'customers',
                'record_id' => $id,
                'request' => $request->all(),
            ]);

            // validate request
            $validated = (object) [
                "user" => $this->validateUser($request, $customer->user_id),
                "customer" => $this->validateCustomer($request),
            ];

            Log::channel('project')->info('Update 2', [
                'table' => 'customers',
                'record_id' => $id,
                'validated' => $validated,
            ]);

            // Update user and customer data
            DB::transaction(function () use ($customer, $validated) {
                $customer->user->update($validated->user);
                $customer->update($validated->customer);
            });

            // Log the update
            Log::channel('project')->info('Customer updated', [
                'user_id' => Auth::user()->id,
                'table' => 'customers',
                'record_id' => $customer->id,
            ]);

            return redirect()->route('customer.show', ['id' => $id])->with('success', 'Customer berhasil diperbarui');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (ModelNotFoundException $e) {
            Log::channel("project")->error("Customer not found", [
                "user_id" => Auth::user()->id,
                "table" => "customers",
            ]);

            return back()->withErrors([
                'message' => 'Customer tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            Log::channel("project")->error("Updating customer", [
                "user_id" => Auth::user()->id,
                "table" => "customers",
            ]);

            return back()->withErrors([
                'message' => $e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {}

    private function validateCustomer(Request $request)
    {
        $customerRequest = new CustomerRequest();
        $customerRules = $customerRequest->rules();

        $validated = Validator::make($request->only(array_keys($customerRules)), $customerRules)->validate();

        return $validated;
    }
}
