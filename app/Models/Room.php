<?php

namespace App\Models;

use App\Models\BaseModel;

class Room extends BaseModel
{
    protected $appends = [
        "facility",
        "count_facility",
    ];

    /**
     * get room facilities
     */
    public function getFacilityAttribute()
    {
        return RoomFacility::where("room_id", $this->id)->with("facility")->get();
    }

    public function getCountFacilityAttribute()
    {
        return $this->facility->count();
    }

    /**
     * table relations
     */
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
