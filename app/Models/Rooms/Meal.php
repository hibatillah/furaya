<?php

namespace App\Models\Rooms;

use App\Models\BaseModel;
use App\Models\Managements\Employee;
use App\Models\Rooms\Room;

class Meal extends BaseModel
{
    /** table relations */
    public function room()
    {
        return $this->hasMany(Room::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
