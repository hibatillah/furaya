<?php

namespace Database\Factories\Reservations;

use App\Models\Managements\Employee;
use App\Models\Reservations\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservations\CheckIn>
 */
class CheckInFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $reservation = Reservation::all()->random();
        $employee = Employee::all()->random();
        $checkInTime = $this->faker->dateTimeBetween(
            $reservation->start_date,
            $reservation->end_date
        );

        return [
            "reservation_id" => $reservation->id,
            "employee_id" => $employee->id,
            "check_in_at" => $checkInTime,
            "check_in_by" => $employee->user->name,
            "notes" => $this->faker->sentence,
        ];
    }
}
