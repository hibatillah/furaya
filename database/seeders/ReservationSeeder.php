<?php

namespace Database\Seeders;

use App\Models\Reservations\CheckIn;
use App\Models\Reservations\Reservation;
use App\Models\Reservations\ReservationGuest;
use App\Models\Reservations\ReservationRoom;
use App\Models\Reservations\ReservationTransaction;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // create reservation and its relations
        $reservations = Reservation::factory()
            ->count(23)
            ->has(ReservationGuest::factory()->count(1))
            ->has(ReservationRoom::factory()->count(1))
            ->has(ReservationTransaction::factory()->count(1))
            ->create();

        // add reservation check-ins table
        foreach ($reservations as $reservation) {
            if ($reservation->status === "checked in") {
                CheckIn::factory()->create([
                    "reservation_id" => $reservation->id,
                    "check_in_at" => $reservation->start_date
                        ->copy()->endOfDay(),
                ]);
            }
        }
    }
}
