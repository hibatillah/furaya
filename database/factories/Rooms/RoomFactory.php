<?php

namespace Database\Factories\Rooms;

use App\Enums\RoomConditionEnum;
use App\Enums\RoomStatusEnum;
use App\Enums\SmokingTypeEnum;
use App\Models\Rooms\BedType;
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
            'room_number' => function () {
                do {
                    $number = $this->faker->numberBetween(100, 400);
                } while (Room::where('room_number', $number)->exists());
                return $number;
            },
            'floor_number' => $this->faker->numberBetween(1, 10),
            'view' => $this->faker->word,
            'condition' => $this->faker->randomElement(RoomConditionEnum::getValues()),
            'status' => $this->faker->randomElement([
                RoomStatusEnum::VC,
                RoomStatusEnum::OO,
                RoomStatusEnum::CO,
                RoomStatusEnum::HU,
            ]),
            'price' => $roomType->base_rate,
            'capacity' => $roomType->capacity,
            'size' => $this->faker->numberBetween(20, 100), // Size in square meters
            'smoking_type' => $this->faker
                ->randomElement(SmokingTypeEnum::getValues()),
            'room_type_id' => $roomType->id,
            'bed_type_id' => BedType::all()->random()->id,
            'rate_type_id' => $roomType->rate_type_id,
        ];
    }
}
