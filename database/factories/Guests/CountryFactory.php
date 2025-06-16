<?php

namespace Database\Factories\Guests;

use App\Models\User;
use App\Models\Guests\Country;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Country>
 */
class CountryFactory extends Factory
{
    protected $model = Country::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "code" => Str::random(3),
            "name" => $this->faker->unique()->word,
            "created_by" => User::where("role", "admin")->first()->id,
        ];
    }
}
