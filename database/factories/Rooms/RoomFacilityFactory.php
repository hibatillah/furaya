<?php

namespace Database\Factories\Rooms;

use App\Models\Rooms\Facility;
use App\Models\Rooms\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rooms\RoomFacility>
 */
class RoomFacilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'room_id' => Room::all()->random()->id,
            'facility_id' => Facility::all()->random()->id,
        ];
    }
}
