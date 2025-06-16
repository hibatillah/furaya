<?php

namespace App\Models\Rooms;

use App\Models\BaseModel;

class BedType extends BaseModel
{
  protected $appends = [
    "rooms_count",
    "can_delete",
  ];

  /**
   * Get the count of rooms in the bed type
   * @return int
   */
  public function getRoomsCountAttribute(): int
  {
    return Room::where("bed_type_id", $this->id)->count();
  }

  /**
   * Can delete if no rooms in the bed type
   * @return bool
   */
  public function getCanDeleteAttribute(): bool
  {
    return $this->rooms_count === 0;
  }

  /** table relations */
  public function room()
  {
    return $this->hasMany(Room::class);
  }
}
