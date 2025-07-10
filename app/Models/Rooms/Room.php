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
        "formatted_room_layout_image",
        "image_files",
    ];

    /**
     * set image File
     */
    public function getImageFilesAttribute()
    {
        $images = is_array($this->formatted_images) ? $this->formatted_images : [];

        return array_map(function ($image) {
            $filename = explode("/", $image);
            $filename = end($filename);

            $type = explode(".", $filename);
            $type = end($type);

            $date = $this->updated_at;
            $formatted = $date->format('D M d Y H:i:s') . ' GMT+0700 (Western Indonesia Time)';

            return [
                "lastModified" => $date->timestamp,
                "name" => $filename,
                "size" => 3 * 1024 * 1024,
                "type" => "image/" . $type,
                "url" => $image,
                "id" => $filename,
                "webkitRelativePath" => $image,
            ];
        }, $images);
    }

    /**
     * format images path
     */
    public function getFormattedRoomLayoutImageAttribute()
    {
        if (!$this->room_layout) return null;

        return Storage::url($this->room_layout);
    }

    /**
     * format images path
     */
    public function getFormattedImagesAttribute()
    {
        $images = is_array($this->images ?? null) ? $this->images : [];

        return array_map(fn($image) => Storage::url($image), $images);
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
