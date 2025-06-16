<?php

namespace Database\Factories\Rooms;

use App\Models\Rooms\BedType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rooms\BedType>
 */
class BedTypeFactory extends Factory
{
    protected $model = BedType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word,
        ];
    }
}
