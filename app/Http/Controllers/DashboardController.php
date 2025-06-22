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
        return Inertia::render('dashboard', [
            'charts' => $this->dashboardService->getAllCharts(),
        ]);
    }
}
