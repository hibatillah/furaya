<?php

namespace App\Models\Guests;

use App\Models\BaseModel;
use App\Models\User;

class Geography extends BaseModel
{
    /**
     * table relations
     */
    public function user()
    {
        return $this->belongsTo(User::class, "created_by");
    }
}
