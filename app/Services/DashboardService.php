<?php

namespace App\Services;

use App\Models\Reservations\Reservation;
use App\Models\Reservations\ReservationRoom;
use App\Models\Reservations\ReservationGuest;
use App\Models\Reservations\ReservationTransaction;
use App\Models\Reservations\CheckIn;
use App\Models\Reservations\CheckOut;
use App\Models\Rooms\RoomFacility;
use App\Models\Rooms\Room;
use App\Models\User;
use Carbon\Carbon;

class DashboardService
{
    /**
     * Get most used facility in room
     */
    public function getMostUsedFacilityByRoom()
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
    public function getUserRoleCount()
    {
        $userRoleCount = User::all()
            ->groupBy('role')
            ->map(fn($group) => $group->count());

        return $userRoleCount;
    }

    /**
     * Get room type distribution
     */
    public function getRoomTypeCount()
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
    public function getBedTypeCount()
    {
        $bedTypeCount = Room::with('bedType')
            ->get()
            ->groupBy('bedType.name')
            ->map(fn($group) => $group->count());

        return $bedTypeCount;
    }

    public function getReservationStatusDistribution()
    {
        return Reservation::select('status')
            ->where('start_date', '>=', now()->startOfDay())
            ->get()
            ->groupBy('status')
            ->map(fn($group) => $group->count())
            ->sortByDesc(fn($count) => $count);
    }

    public function getMonthlyReservationVolume()
    {
        return Reservation::select('start_date')
            ->get()
            ->groupBy(fn($res) => Carbon::parse($res->start_date)->format('Y-m'))
            ->map(fn($group) => $group->count())
            ->sortKeys();
    }

    public function getDailyReservationVolume(): array
    {
        // Get the earliest and latest reservation dates
        $minDate = Reservation::min('start_date');
        $maxDate = Reservation::max('start_date');

        if (!$minDate || !$maxDate) {
            return []; // no data at all
        }

        $start = Carbon::parse($minDate)->startOfMonth();
        $end = Carbon::parse($maxDate)->endOfMonth();

        // Fetch all existing counts grouped by date
        $dailyCounts = Reservation::selectRaw('DATE(start_date) as date, COUNT(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date'); // e.g. ['2024-10-25' => 1, ...]

        // Build full date range with fallback to 0
        $dates = [];
        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $key = $date->toDateString();
            $dates[$key] = (int) ($dailyCounts[$key] ?? 0);
        }

        return $dates;
    }

    /**
     * Popularity room type by reservation
     */
    public function getRoomTypePopularity()
    {
        return ReservationRoom::select('room_type_name')
            ->get()
            ->groupBy('room_type_name')
            ->map(fn($group) => $group->count())
            ->sortByDesc(fn($count) => $count);
    }

    /**
     * Get top guest nationalities by reservation
     */
    public function getTopGuestNationalities($limit = 10)
    {
        return ReservationGuest::select('nationality')
            ->get()
            ->groupBy('nationality')
            ->map(fn($group) => $group->count())
            ->sortByDesc(fn($count) => $count)
            ->take($limit);
    }

    public function getAverageLengthOfStayByMonth()
    {
        return Reservation::select('start_date', 'length_of_stay')
            ->whereNotNull('length_of_stay')
            ->get()
            ->groupBy(fn($r) => Carbon::parse($r->start_date)->format('Y-m'))
            ->map(fn($group) => round($group->avg('length_of_stay')));
    }

    /**
     * Get total revenue by month
     */
    public function getTotalRevenueByMonth()
    {
        return Reservation::all()
            ->groupBy(fn($t) => Carbon::parse($t->start_date)->format('Y-m'))
            ->map(fn($group) => round($group->sum('total_price'), 2))
            ->sortKeys();
    }

    public function getReservationCountPerEmployee()
    {
        return Reservation::with('employee.user')
            ->get()
            ->groupBy(fn($r) => optional($r->employee)->user->name ?? 'Unknown')
            ->map(fn($group) => $group->count())
            ->sortByDesc(fn($count) => $count);
    }

    public function getGuestTypeDistribution()
    {
        return Reservation::select('guest_type')
            ->get()
            ->groupBy('guest_type')
            ->map(fn($group) => $group->count())
            ->sortByDesc(fn($count) => $count);
    }

    public function getAverageCheckInByMonth()
    {
        return CheckIn::select('check_in_at')
            ->get()
            ->groupBy(fn($c) => Carbon::parse($c->check_in_at)->format('Y-m'))
            ->map(fn($group) => round($group->avg(fn($checkIn) => Carbon::parse($checkIn->check_in_at)->day)))
            ->sortKeys();
    }

    public function getPaxTrend($month = null)
    {
        $month = $month ?? Carbon::now()->format('Y-m');

        return Reservation::select('start_date', 'pax')
            ->whereMonth('start_date', Carbon::parse($month)->month)
            ->whereYear('start_date', Carbon::parse($month)->year)
            ->get()
            ->groupBy(fn($r) => Carbon::parse($r->start_date)->format('Y-m-d'))
            ->map(fn($group) => $group->sum('pax'))
            ->sortKeys();
    }

    public function getGuestNationalityDistribution()
    {
        return ReservationGuest::select('nationality')
            ->get()
            ->groupBy('nationality')
            ->map(fn($group) => $group->count())
            ->sortByDesc(fn($count) => $count)
            ->take(10);
    }

    public function getTopGuestsByReservationCount()
    {
        return ReservationGuest::with("reservation")
            ->select('name', 'nationality')
            ->get()
            ->groupBy('name')
            ->map(fn($group) => $group->count())
            ->sortByDesc(fn($count) => $count)
            ->take(7);
    }

    public function getRoomSmokingTypeDistribution()
    {
        return Room::all()
            ->groupBy('smoking_type')
            ->map(fn($group) => $group->count());
    }

    public function getSmokingTypeReservation()
    {
        return Reservation::select('smoking_type')
            ->get()
            ->groupBy('smoking_type')
            ->map(fn($group) => $group->count());
    }

    public function getAllCharts()
    {
        return [
            'user_role_count' => $this->getUserRoleCount(),
            'room_type_count' => $this->getRoomTypeCount(),
            'bed_type_count' => $this->getBedTypeCount(),
            'most_used_facility_by_room' => $this->getMostUsedFacilityByRoom(),
            'reservation_status_distribution' => $this->getReservationStatusDistribution(),
            'monthly_reservation_volume' => $this->getMonthlyReservationVolume(),
            'daily_reservation_volume' => $this->getDailyReservationVolume(),
            'room_type_popularity' => $this->getRoomTypePopularity(),
            'top_guest_nationalities' => $this->getTopGuestNationalities(),
            'average_length_of_stay_by_month' => $this->getAverageLengthOfStayByMonth(),
            'total_revenue_by_month' => $this->getTotalRevenueByMonth(),
            'reservation_count_per_employee' => $this->getReservationCountPerEmployee(),
            'guest_type_distribution' => $this->getGuestTypeDistribution(),
            'average_check_in_by_month' => $this->getAverageCheckInByMonth(),
            'pax_trend' => $this->getPaxTrend(),
            'guest_nationality_distribution' => $this->getGuestNationalityDistribution(),
            'top_guests_by_reservation_count' => $this->getTopGuestsByReservationCount(),
            'room_smoking_type_distribution' => $this->getRoomSmokingTypeDistribution(),
            'smoking_type_reservation' => $this->getSmokingTypeReservation(),
        ];
    }
}
