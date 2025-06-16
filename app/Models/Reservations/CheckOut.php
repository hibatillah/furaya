<?php

namespace App\Models\Reservations;

use App\Models\BaseModel;
use App\Models\Managements\Employee;

class CheckOut extends BaseModel
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
