<?php

namespace Database\Factories\Guests;

use App\Models\User;
use App\Models\Guests\Geography;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Guests\Geography>
 */
class GeographyFactory extends Factory
{
    protected $model = Geography::class;

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
