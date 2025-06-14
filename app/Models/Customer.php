<?php

namespace App\Models;

use App\Models\BaseModel;
use Carbon\Carbon;

class Customer extends BaseModel
{
    protected $appends = [
        'formatted_birthdate',
        'formatted_gender',
    ];

    public function getNameAttribute()
    {
        return $this->user->name;
    }

    public function getFormattedGenderAttribute()
    {
        return $this->gender === 'male' ? 'Pria' : 'Wanita';
    }

    public function getFormattedBirthdateAttribute()
    {
        if (!$this->birthdate) return "-";
        return Carbon::parse($this->birthdate)->translatedFormat('j F, Y');
    }

    /**
     * table relations
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
