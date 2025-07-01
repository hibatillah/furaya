<?php

namespace App\Services;

use App\Models\Reservations\Reservation;
use App\Enums\ReservationStatusEnum;
use App\Enums\RoomConditionEnum;
use App\Enums\RoomStatusEnum;
use App\Enums\StatusAccEnum;
use App\Models\Reservations\ReservationRoom;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomType;
use Carbon\Carbon;

class ReservationService
{
    /**
     * Generate a unique booking number
     * based on the current date and count of today's reservations
     */
    public static function generateBookingNumber(): string
    {
        $timestamp = now()->format('YmdH');
        $count = Reservation::whereDate('created_at', today())->count() + 1;
        $number = str_pad($count, 4, '0', STR_PAD_LEFT);

        return "{$timestamp}{$number}";
    }

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
        return ReservationRoom::whereNotNull('room_id')
            ->whereHas('reservation', function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '<', $endDate)
                    ->where('end_date', '>', $startDate);
            })->pluck('room_id');
    }

    /**
     * Get available rooms
     * based on reserved room ids and room_type_id
     *
     * @param \Illuminate\Support\Collection $reservedRoomIds
     * @param ?string $roomTypeId
     * @return \Illuminate\Support\Collection
     */
    public function getAvailableRooms(
        \Illuminate\Support\Collection $reservedRoomIds,
        ?string $roomTypeId
    ) {
        return Room::with('roomType', 'bedType')
            ->whereIn('status', [
                RoomStatusEnum::VC,
                RoomStatusEnum::OO,
                RoomStatusEnum::CO,
                RoomStatusEnum::HU,
            ])
            ->whereNotIn('id', $reservedRoomIds)
            ->when($roomTypeId, function ($query) use ($roomTypeId) {
                $query->where('room_type_id', $roomTypeId);
            })
            ->get();
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
        return RoomType::withCount([
            'room as available_rooms_count' => function ($query) use ($reservedRoomIds) {
                $query->whereNotIn('id', $reservedRoomIds)
                    ->whereIn('status', [
                        RoomStatusEnum::VC,
                        RoomStatusEnum::OO,
                        RoomStatusEnum::CO,
                        RoomStatusEnum::HU,
                    ]);
            }
        ])
            ->get()
            ->filter(function ($roomType) {
                return $roomType->available_rooms_count > 0;
            })
            ->values();
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
     * Update reservation acc status
     */
    public function updateAccStatus(string $reservationId, string $status)
    {
        $reservation = Reservation::findOrFail($reservationId);
        $reservation->status_acc = $status;
        $reservation->save();
    }

    /**
     * Update reservation status manually
     */
    public function updateStatus(string $reservationId, string $status)
    {
        $reservation = Reservation::findOrFail($reservationId);
        $reservation->status = $status;
        $reservation->save();
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
        ])
            ->whereNot("status_acc", StatusAccEnum::REJECTED)
            ->get();

        if (!$reservations->isEmpty()) {
            foreach ($reservations as $reservation) {
                $reservation->updateReservationStatus();
            }
        }
    }
}
