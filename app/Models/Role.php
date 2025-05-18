<?php

namespace App\Models;

use App\Models\BaseModel;

class Role extends BaseModel
{
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
