<?php

namespace App\Models\Rooms;

use App\Models\BaseModel;
use Illuminate\Support\Facades\Storage;

class RoomType extends BaseModel
{
  protected $casts = [
    "images" => "array",
  ];

  protected $appends = [
    "rooms_count",
    "can_delete",
    "facilities_count",
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
   * `facilities_count`
   * Get the count of facilities in the room type
   * @return int
   */
  public function getFacilitiesCountAttribute(): int
  {
    return $this->facility()->count();
  }

  /**
   * table relations
   */
  public function facility()
  {
    return $this->belongsToMany(Facility::class, "room_type_facilities");
  }

  public function rateType()
  {
    return $this->belongsTo(RateType::class);
  }

  public function room()
  {
    return $this->hasMany(Room::class);
  }

  public function bedType()
  {
    return $this->belongsTo(BedType::class);
  }
}
