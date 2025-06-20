<?php

namespace App\Http\Controllers;

use App\Models\Rooms\Room;
use App\Models\Rooms\RoomFacility;
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
            'mostUsedFacilityByRoom' => $this->getMostUsedFacilityByRoom(),
        ]);
    }

    /**
     * Get most used facility in room
     */
    private function getMostUsedFacilityByRoom()
    {
        $mostUsedFacilityInRoom = RoomFacility::with('facility')
            ->get()
            ->groupBy('facility.name')
            ->map(fn($group) => $group->count())
            ->sortByDesc(fn($count) => $count)
            ->take(7);

        return $mostUsedFacilityInRoom;
    }

    /**
     * Get the count of users by role
     */
    private function getUserRoleCount()
    {
        $userRoleCount = User::all()
            ->groupBy('role')
            ->map(fn($group) => $group->count());

        return $userRoleCount;
    }

    /**
     * Get the count of rooms by room type
     */
    private function getRoomTypeCount()
    {
        $roomTypeCount = Room::with('roomType')
            ->get()
            ->groupBy('roomType.name')
            ->map(fn($group) => $group->count())
            ->take(5);

        return $roomTypeCount;
    }

    /**
     * Get the count of rooms by bed type
     */
    private function getBedTypeCount()
    {
        $bedTypeCount = Room::with('bedType')
            ->get()
            ->groupBy('bedType.name')
            ->map(fn($group) => $group->count());

        return $bedTypeCount;
    }
}
