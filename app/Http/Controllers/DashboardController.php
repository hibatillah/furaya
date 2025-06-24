<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboard)
    {
        $this->dashboardService = $dashboard;
    }

    public function index()
    {
        try {
            throw new \Exception("test");
            return Inertia::render('dashboard', [
                'charts' => $this->dashboardService->getAllCharts(),
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => $e->getMessage(),
            ]);
        }
    }
}
