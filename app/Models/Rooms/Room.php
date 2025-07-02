<?php

namespace App\Models\Rooms;

use App\Models\BaseModel;
use App\Models\Reservations\ReservationRoom;
use Illuminate\Support\Facades\Storage;

class Room extends BaseModel
{
    protected $casts = [
        "images" => "array",
    ];

    protected $appends = [
        "facility",
        "count_facility",
        "formatted_images",
    ];

    /**
     * format images path
     */
    public function getFormattedImagesAttribute()
    {
        return array_map(fn($image) => Storage::url($image), $this->images ?? []);
    }

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
}
