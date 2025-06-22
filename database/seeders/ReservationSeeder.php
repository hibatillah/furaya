<?php

namespace Database\Seeders;

use App\Enums\ReservationStatusEnum;
use App\Models\Reservations\CheckIn;
use App\Models\Reservations\CheckOut;
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
            ->count(500)
            ->has(ReservationGuest::factory()->count(1))
            ->has(ReservationRoom::factory()->count(1))
            ->has(ReservationTransaction::factory()->count(1))
            ->create();

        // add reservation check-ins table
        foreach ($reservations as $reservation) {
            $id = $reservation->id;
            $start = $reservation->start_date;
            $end = $reservation->end_date;

            if (
                $start->isBefore(now())
                && $reservation->status === ReservationStatusEnum::CHECKED_IN
            ) {
                CheckIn::factory()->create([
                    "reservation_id" => $id,
                    "check_in_at" => $start->copy()->endOfDay(),
                ]);

                if ($end->isBefore(now())) {
                    CheckOut::factory()->create([
                        "reservation_id" => $id,
                        "check_out_at" => $end
                            ->copy()->setTime(10, 0),
                        "final_total" => $reservation->total_price,
                    ]);
                }
            }
        }
    }
}
