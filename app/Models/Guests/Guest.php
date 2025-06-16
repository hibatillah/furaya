<?php

namespace App\Models\Guests;

use App\Models\BaseModel;
use App\Models\Reservations\ReservationGuest;
use App\Models\User;
use Carbon\Carbon;

class Guest extends BaseModel
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

    public function reservationGuest()
    {
        return $this->hasMany(ReservationGuest::class);
    }
}
