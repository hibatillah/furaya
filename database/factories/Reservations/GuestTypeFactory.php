<?php

namespace Database\Factories\Reservations;

use App\Models\Reservations\GuestType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservations\GuestType>
 */
class GuestTypeFactory extends Factory
{
    protected $model = GuestType::class;

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
