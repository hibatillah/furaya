<?php

namespace Database\Factories\Reservations;

use App\Models\Managements\Employee;
use App\Models\Reservations\Reservation;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservations\CheckOut>
 */
class CheckOutFactory extends Factory
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
        $checkOutTime = $this->faker->dateTimeBetween(
            Carbon::parse($reservation->start_date)->endOfDay(),
            Carbon::parse($reservation->end_date)->setTime(10, 0)
        );

        return [
            "reservation_id" => $reservation->id,
            "employee_id" => $employee->id,
            "check_out_at" => $checkOutTime,
            "check_out_by" => $employee->user->name,
            "final_total" => $reservation->total_price,
            "notes" => $this->faker->sentence,
        ];
    }
}
