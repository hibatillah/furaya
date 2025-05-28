<?php

namespace App\Models;

class RoomStatus extends BaseModel
{
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
