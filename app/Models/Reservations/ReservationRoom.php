<?php

namespace App\Models\Reservations;

use App\Models\BaseModel;
use App\Models\Rooms\Room;

class ReservationRoom extends BaseModel
{
    /**
     * table relations
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
