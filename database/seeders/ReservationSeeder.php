<?php

namespace Database\Seeders;

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
        Reservation::factory()
            ->count(10)
            ->has(ReservationGuest::factory()->count(1))
            ->has(ReservationRoom::factory()->count(1))
            ->has(ReservationTransaction::factory()->count(1))
            ->create();
    }
}
