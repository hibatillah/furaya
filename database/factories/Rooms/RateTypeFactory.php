<?php

namespace Database\Factories\Rooms;

use App\Models\Rooms\RateType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rooms\RateType>
 */
class RateTypeFactory extends Factory
{
    protected $model = RateType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => Str::random(3),
            'name' => $this->faker->unique()->word,
            'rate' => $this->faker->randomFloat(2, 0, 1000000),
        ];
    }
}
