<?php

namespace App\Models;

use App\Models\BaseModel;

class Admin extends BaseModel
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
