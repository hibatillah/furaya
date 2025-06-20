<?php

namespace Database\Factories\Guests;

use App\Enums\GenderEnum;
use App\Models\Guests\Nationality;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Guests\Guest>
 */
class GuestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "user_id" => $this->faker->unique()->numberBetween(1, 20),
            "nik_passport" => $this->faker->unique()->word(10),
            "birthdate" => $this->faker->dateTimeBetween('-50 years', '-17 years'),
            "gender" => $this->faker->randomElement(GenderEnum::getValues()),
            "phone" => $this->faker->unique()->numerify('+628#########'),
            "profession" => $this->faker->jobTitle,
            "nationality" => Nationality::all()->random()->name,
            "address" => $this->faker->address,
        ];
    }
}
