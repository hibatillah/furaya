<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\ManagerRequest;
use Inertia\Inertia;
use App\Models\Manager;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ManagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $managers = Manager::with('user')->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('manager/index', [
            'managers' => $managers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('manager/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ManagerRequest $request)
    {
        $manager = Manager::create($request->validated());

        Log::channel('project')->info('Manager created', [
            'user_id' => Auth::user()->id,
            'table' => 'managers',
            'record_id' => $manager->id,
        ]);
        
        return redirect()->route('manager.index')->with('success', 'Manajer berhasil ditambahkan');
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
            $manager = Manager::with('user')->findOrFail($id);

            return Inertia::render('manager/edit', [
                'manager' => $manager,
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->with('warning', 'Manajer tidak ditemukan');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ManagerRequest $request, string $id)
    {
        try {
            $manager = Manager::findOrFail($id);
            $manager->update($request->validated());

            Log::channel('project')->info('Manager updated', [
                'user_id' => Auth::user()->id,
                'table' => 'managers',
                'record_id' => $manager->id,
            ]);

            return redirect()->route('manager.index')->with('success', 'Manajer berhasil diperbarui');
        } catch (ModelNotFoundException $e) {
            return back()->with('warning', 'Manajer tidak ditemukan');
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
            $manager = Manager::findOrFail($id);

            Log::channel('project')->info('Manager deleted', [
                'user_id' => Auth::user()->id,
                'table' => 'managers',
                'record_id' => $manager->id,
            ]);

            $manager->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('warning', 'Manajer tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
