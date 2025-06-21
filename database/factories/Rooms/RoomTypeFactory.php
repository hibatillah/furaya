<?php

namespace Database\Factories\Rooms;

use App\Enums\SmokingTypeEnum;
use App\Models\Rooms\Meal;
use App\Models\Rooms\RateType;
use App\Models\Rooms\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rooms\RoomType>
 */
class RoomTypeFactory extends Factory
{
    protected $model = RoomType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $rateType = RateType::all()->random();

        return [
            'code' => Str::random(3),
            'name' => $this->faker->unique()->word,
            'capacity' => $this->faker->numberBetween(1, 3),
            'size' => $this->faker->numberBetween(20, 100), // Size in square meters
            'smoking_type' => $this->faker
                ->randomElement(SmokingTypeEnum::getValues()),
            'base_rate' => $rateType->rate,
            'rate_type_id' => $rateType->id,
        ];
    }
}
