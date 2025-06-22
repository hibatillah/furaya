<?php

namespace App\Services;

use App\Models\Reservations\Reservation;
use App\Enums\ReservationStatusEnum;
use App\Enums\RoomConditionEnum;
use App\Enums\RoomStatusEnum;
use App\Models\Reservations\ReservationRoom;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomType;
use Carbon\Carbon;

class ReservationService
{
    /**
     * Get roomIDs that are reserved
     * based on reservation date
     *
     * @param string $startDate
     * @param string $endDate
     * @return \Illuminate\Support\Collection
     */
    public function getReservedRoomIds(string $startDate, string $endDate)
    {
        return ReservationRoom::whereHas(
            'reservation',
            function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '<=', $endDate)
                    ->where('end_date', '>=', $startDate);
            }
        )->pluck('room_id');
    }

    /**
     * Get available rooms
     * based on reserved room ids and room_type_id
     *
     * @param \Illuminate\Support\Collection $reservedRoomIds
     * @param int $roomTypeId
     * @return \Illuminate\Support\Collection
     */
    public function getAvailableRooms(
        \Illuminate\Support\Collection $reservedRoomIds,
        int $roomTypeId
    ) {
        $rooms = Room::with('roomType', 'bedType', 'meal')
            ->whereIn('status', [
                RoomStatusEnum::VC,
                RoomStatusEnum::OO,
                RoomStatusEnum::CO,
                RoomStatusEnum::HU,
            ])
            ->whereNotIn('condition', [
                RoomConditionEnum::BOOKED,
                RoomConditionEnum::BOOKED_CLEANING,
            ])
            ->whereNotIn('id', $reservedRoomIds) // exclude overlapping reservations
            ->where('room_type_id', $roomTypeId)
            ->get();

        return $rooms;
    }

    /**
     * Get available room types
     * based on reserved room ids
     *
     * @param \Illuminate\Support\Collection $reservedRoomIds
     * @return \Illuminate\Support\Collection
     */
    public function getAvailableRoomTypes(
        \Illuminate\Support\Collection $reservedRoomIds
    ) {
        $roomTypes = RoomType::whereHas(
            'room',
            function ($query) use ($reservedRoomIds) {
                $query->whereIn('status', [
                    RoomStatusEnum::VC,
                    RoomStatusEnum::OO,
                    RoomStatusEnum::CO,
                    RoomStatusEnum::HU,
                ])
                    ->whereNotIn('condition', [
                        RoomConditionEnum::BOOKED,
                        RoomConditionEnum::BOOKED_CLEANING,
                    ])
                    ->whereNotIn('id', $reservedRoomIds);
            }
        )
            ->get();

        return $roomTypes;
    }

    /**
     * Get the date range based on the type
     *
     * @param string $type
     * @param string|null $start
     * @param string|null $end
     * @return array [start_date, end_date]
     */
    public function getDateRange(
        string $type,
        ?string $start,
        ?string $end
    ): array {
        $today = Carbon::today();

        switch ($type) {
            case 'last_30_days':
                return [
                    $today->copy()->subDays(30)->startOfDay(),
                    $today->copy()->endOfDay()
                ];

            case 'last_3_months':
                return [
                    $today->copy()->subMonths(3)->startOfDay(),
                    $today->copy()->endOfDay()
                ];

            case 'last_6_months':
                return [
                    $today->copy()->subMonths(6)->startOfDay(),
                    $today->copy()->endOfDay()
                ];

            case 'last_year':
                return [
                    $today->copy()->subYear()->startOfDay(),
                    $today->copy()->endOfDay()
                ];

            case 'custom_range':
                $start_date = $start
                    ? Carbon::parse($start)->startOfDay()
                    : null;
                $end_date = $end
                    ? Carbon::parse($end)->endOfDay()
                    : $today->copy()->endOfDay();

                return [$start_date, $end_date];

            case 'upcoming':
            default:
                return [$today->copy()->startOfDay(), null];
        }
    }

    /**
     * Update reservation status manually
     */
    public function updateStatus(string $reservationId, string $status)
    {
        $reservation = Reservation::findOrFail($reservationId);
        $reservation->update([
            "status" => $status,
        ]);
    }

    /**
     * Update reservation status automatically for on going reservations
     */
    public function updateOnGoingStatus()
    {
        $reservations = Reservation::whereNotIn("status", [
            ReservationStatusEnum::CHECKED_OUT,
            ReservationStatusEnum::NO_SHOW,
            ReservationStatusEnum::CANCELLED,
            ReservationStatusEnum::OVERDUE,
        ])->get();

        if (!$reservations->isEmpty()) {
            foreach ($reservations as $reservation) {
                $reservation->updateReservationStatus();
            }
        }
    }
}
