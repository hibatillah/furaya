<?php

namespace App\Models;

use App\Models\BaseModel;

class RoomType extends BaseModel
{
  protected $appends = [
    "rooms_count",
  ];

  /**
   * Get the count of rooms in the room type
   * @return int
   */
  public function getRoomsCountAttribute(): int
  {
    return Room::where("room_type_id", $this->id)->count();
  }
}