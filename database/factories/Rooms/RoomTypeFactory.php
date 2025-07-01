<?php

namespace Database\Factories\Rooms;

use App\Models\Rooms\BedType;
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
            'base_rate' => $rateType->rate,
            'rate_type_id' => $rateType->id,
            'bed_type_id' => BedType::all()->random()->id,
        ];
    }
}
