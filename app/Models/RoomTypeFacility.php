<?php

namespace App\Models;

class RoomTypeFacility extends BaseModel
{
    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }

    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }
}
