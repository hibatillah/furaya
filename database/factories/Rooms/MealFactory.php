<?php

namespace Database\Factories\Rooms;

use App\Models\Managements\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rooms\Meal>
 */
class MealFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "code" => $this->faker->unique()->word,
            "name" => $this->faker->unique()->word,
            "created_by" => Employee::all()->random()->id,
        ];
    }
}
