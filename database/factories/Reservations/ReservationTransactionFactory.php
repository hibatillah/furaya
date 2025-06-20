<?php

namespace Database\Factories\Reservations;

use App\Models\Reservations\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservations\ReservationTransaction>
 */
class ReservationTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $reservation = Reservation::all()->random();

        return [
            "reservation_id" => $reservation->id,
            "description" => "Booking Payment",
            "amount" => $reservation->total_price,
        ];
    }
}
