<?php

namespace App\Models\Rooms;

use App\Models\BaseModel;
use App\Models\Rooms\RoomFacility;

class Facility extends BaseModel
{
  protected $appends = [
    "rooms_count",
    "can_delete",
  ];

  /**
   * Get the count of rooms in the facility
   * @return int
   */
  public function getRoomsCountAttribute(): int
  {
    return RoomFacility::where("facility_id", $this->id)->count();
  }

  /**
   * Can delete if no rooms in the facility
   * @return bool
   */
  public function getCanDeleteAttribute(): bool
  {
    return $this->rooms_count === 0;
  }

  /** table relations */
  public function roomType()
  {
    return $this->belongsToMany(RoomType::class, "room_type_facilities");
  }

  public function room()
  {
    return $this->belongsToMany(Room::class, "room_facilities");
  }
}
