<?php

namespace App\Models;

use App\Models\BaseModel;
use Carbon\Carbon;

class Employee extends BaseModel
{
    protected $appends = ['formatted_hire_date', 'formatted_gender'];

    public function getFormattedGenderAttribute()
    {
        return $this->gender === 'male' ? 'Pria' : 'Wanita';
    }

    public function getFormattedHireDateAttribute()
    {
        if (!$this->hire_date) return "-";
        return Carbon::parse($this->hire_date)->translatedFormat('j F, Y');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
