<?php

namespace App\Models;

use App\Models\BaseModel;

class RoomType extends BaseModel
{
  protected $appends = [
    "rooms_count",
    "can_delete",
    "facilities_count",
  ];

  /**
   * `rooms_count`
   * Get the count of rooms in the room type
   * @return int
   */
  public function getRoomsCountAttribute(): int
  {
    return Room::where("room_type_id", $this->id)->count();
  }

  /**
   * `can_delete`
   * Can delete if no rooms in the room type
   * @return bool
   */
  public function getCanDeleteAttribute(): bool
  {
    return $this->rooms_count === 0;
  }

  /**
   * Get the facilities of the room type
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
  public function roomTypeFacility()
  {
    return $this->hasMany(RoomTypeFacility::class, "room_type_id", "id")->with("facility");
  }

  /**
   * Get the facilities through the pivot table
   * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
   */
  public function facility()
  {
    return $this->belongsToMany(Facility::class, RoomTypeFacility::class, 'room_type_id', 'facility_id');
  }

  /**
   * `facilities_count`
   * Get the count of facilities in the room type
   * @return int
   */
  public function getFacilitiesCountAttribute(): int
  {
    return $this->facility()->count();
  }
}
