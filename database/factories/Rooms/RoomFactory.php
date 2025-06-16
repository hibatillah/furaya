<?php

namespace Database\Factories\Rooms;

use App\Enums\RoomConditionEnum;
use App\Enums\RoomStatusEnum;
use App\Models\Rooms\BedType;
use App\Models\Rooms\RateType;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rooms\Room>
 */
class RoomFactory extends Factory
{
    protected $model = Room::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roomType = RoomType::all()->random();

        return [
            'room_number' => $this->faker->unique()->numberBetween(100, 200),
            'floor_number' => $this->faker->numberBetween(1, 10),
            'view' => $this->faker->word,
            'condition' => $this->faker->randomElement(RoomConditionEnum::getValues()),
            'status' => $this->faker->randomElement(RoomStatusEnum::getValues()),
            'price' => $roomType->base_rate,
            'capacity' => $roomType->capacity,
            'room_type_id' => $roomType->id,
            'bed_type_id' => BedType::all()->random()->id,
            'rate_type_id' => $roomType->rate_type_id,
            'meal_id' => null,
        ];
    }
}
