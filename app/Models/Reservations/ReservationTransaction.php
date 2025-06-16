<?php

namespace App\Models\Reservations;

use App\Models\BaseModel;

class ReservationTransaction extends BaseModel
{
    /**
     * table relations
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
