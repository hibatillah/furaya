<?php

namespace App\Models;

use App\Models\BaseModel;

class CheckIn extends BaseModel
{
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
