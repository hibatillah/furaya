<?php

namespace Database\Factories\Rooms;

use App\Models\Rooms\Facility;
use App\Models\Rooms\RoomType;
use App\Models\Rooms\RoomTypeFacility;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rooms\RoomTypeFacility>
 */
class RoomTypeFacilityFactory extends Factory
{
    protected $model = RoomTypeFacility::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'room_type_id' => RoomType::all()->random()->id,
            'facility_id' => Facility::all()->random()->id,
        ];
    }
}
