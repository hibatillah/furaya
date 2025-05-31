<?php

namespace App\Models;

use App\Models\BaseModel;

class BedType extends BaseModel
{
  protected $appends = [
    "rooms_count",
  ];

  /**
   * Get the count of rooms in the bed type
   * @return int
   */
  public function getRoomsCountAttribute(): int
  {
    return Room::where("bed_type_id", $this->id)->count();
  }
}
