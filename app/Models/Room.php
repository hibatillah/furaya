<?php

namespace App\Models;

use App\Models\BaseModel;

class Room extends BaseModel
{
    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }

    public function bedType()
    {
        return $this->belongsTo(BedType::class);
    }

    public function roomStatus()
    {
        return $this->belongsTo(RoomStatus::class);
    }
}
