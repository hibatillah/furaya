<?php

namespace App\Models\Rooms;

use App\Models\BaseModel;

class RoomFacility extends BaseModel
{
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }
}
