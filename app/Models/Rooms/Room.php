<?php

namespace App\Models\Rooms;

use App\Models\BaseModel;
use App\Models\Reservations\ReservationRoom;

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

    public function facility()
    {
        return $this->belongsToMany(Facility::class, "room_facilities");
    }

    public function reservationRoom()
    {
        return $this->hasMany(ReservationRoom::class);
    }

    public function rateType()
    {
        return $this->belongsTo(RateType::class);
    }

    public function meal()
    {
        return $this->belongsTo(Meal::class);
    }
}
