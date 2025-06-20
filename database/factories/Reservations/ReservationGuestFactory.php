<?php

namespace Database\Factories\Reservations;

use App\Models\Guests\Guest;
use App\Models\Reservations\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservations\ReservationGuest>
 */
class ReservationGuestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $guest = Guest::all()->random();

        return [
            "reservation_id" => Reservation::all()->random()->id,
            "guest_id" => $guest->id,
            "nik_passport" => $guest->nik_passport,
            "name" => $guest->name,
            "phone" => $guest->phone,
            "email" => $guest->email,
            "address" => $guest->address,
            "nationality" => $guest->nationality,
            "country" => $guest->country,
        ];
    }
}
