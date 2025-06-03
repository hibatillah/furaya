<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'userRoleCount' => $this->getUserRoleCount(),
            'roomTypeCount' => $this->getRoomTypeCount(),
            'bedTypeCount' => $this->getBedTypeCount(),
        ]);
    }

    private function getUserRoleCount()
    {
        $users = User::all();
        $userRoleCount = $users->groupBy('role')->map(function ($group) {
            return $group->count();
        });

        return $userRoleCount;
    }

    private function getRoomTypeCount()
    {
        $roomTypes = Room::with('roomType')->get();
        $roomTypeCount = $roomTypes->groupBy('roomType.name')->map(function ($group) {
            return $group->count();
        });

        return $roomTypeCount;
    }

    private function getBedTypeCount()
    {
        $bedTypes = Room::with('bedType')->get();
        $bedTypeCount = $bedTypes->groupBy('bedType.name')->map(function ($group) {
            return $group->count();
        });

        return $bedTypeCount;
    }
}
