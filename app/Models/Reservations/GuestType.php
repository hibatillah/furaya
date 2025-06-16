<?php

namespace App\Models\Reservations;

use App\Models\BaseModel;
use App\Models\User;

class GuestType extends BaseModel
{
    /**
     * table relations
     */
    public function user()
    {
        return $this->belongsTo(User::class, "created_by");
    }
}
