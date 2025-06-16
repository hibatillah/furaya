<?php

namespace App\Models\Reservations;

use App\Models\BaseModel;
use App\Models\Guests\Guest;

class ReservationGuest extends BaseModel
{
    /**
     * table relations
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
}
