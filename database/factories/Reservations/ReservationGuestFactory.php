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

        $countries = [
            'Indonesia' => 'id',
            'Malaysia' => 'my',
            'United States' => 'us',
            'Singapore' => 'sg',
            'Thailand' => 'th',
        ];

        $country = $this->faker->randomElement(array_keys($countries));
        $countryCode = $countries[$country];

        return [
            "reservation_id" => Reservation::all()->random()->id,
            "guest_id" => $guest->id,
            "nik_passport" => $guest->nik_passport,
            "name" => $guest->name,
            "phone" => $guest->phone,
            "email" => $guest->email,
            "address" => $guest->address,
            "nationality" => $country,
            "nationality_code" => $countryCode,
            "country" => $country,
            "country_code" => $countryCode,
        ];
    }
}
