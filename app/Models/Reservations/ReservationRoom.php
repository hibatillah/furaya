<?php

namespace App\Models\Reservations;

use App\Models\BaseModel;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomType;

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

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }
}
