<?php

namespace App\Models\Rooms;

use App\Models\BaseModel;

class RateType extends BaseModel
{
    protected $appends = ["rooms_count"];

    public function getRoomsCountAttribute()
    {
        return $this->room()->count();
    }

    /** table relations */
    public function room()
    {
        return $this->hasMany(Room::class);
    }
}