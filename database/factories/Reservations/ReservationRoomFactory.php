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
        $room = Room::with("roomType", "bedType")->get()->random();

        return [
            "reservation_id" => Reservation::all()->random()->id,
            "room_id" => $room->id,
            "room_type_id" => $room->roomType->id,
            "room_type_name" => $room->roomType->name,
            "room_number" => $room->room_number,
            "room_rate" => $room->price,
            "bed_type" => $room->bedType->name,
            "view" => $room->view,
        ];
    }
}
