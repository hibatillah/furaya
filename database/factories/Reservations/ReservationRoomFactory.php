<?php

namespace Database\Factories\Reservations;

use App\Models\Rooms\Room;
use App\Models\Reservations\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservations\ReservationRoom>
 */
class ReservationRoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $room = Room::with("roomType", "bedType", "meal")->get()->random();

        return [
            "reservation_id" => Reservation::all()->random()->id,
            "room_id" => $room->id,
            "room_number" => $room->room_number,
            "room_type" => $room->roomType->name,
            "room_rate" => $room->price,
            "bed_type" => $room->bedType->name,
            "meal" => $room->meal->name,
            "view" => $room->view,
        ];
    }
}
