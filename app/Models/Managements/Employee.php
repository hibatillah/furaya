<?php

namespace App\Models\Managements;

use App\Models\BaseModel;
use App\Models\Guests\Country;
use App\Models\Guests\Geography;
use App\Models\Guests\Nationality;
use App\Models\Reservations\CheckIn;
use App\Models\Reservations\CheckOut;
use App\Models\Reservations\GuestType;
use App\Models\Rooms\Meal;
use App\Models\Reservations\Reservation;
use App\Models\User;
use Carbon\Carbon;

class Employee extends BaseModel
{
    protected $appends = [
        'formatted_hire_date',
        'formatted_gender'
    ];

    public function getFormattedGenderAttribute()
    {
        return $this->gender === 'male' ? 'Pria' : 'Wanita';
    }

    public function getFormattedHireDateAttribute()
    {
        if (!$this->hire_date) return "-";
        return Carbon::parse($this->hire_date)->translatedFormat('j F, Y');
    }

    /** table relations */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function reservation()
    {
        return $this->hasMany(Reservation::class);
    }

    public function checkIn()
    {
        return $this->hasMany(CheckIn::class);
    }

    public function checkOut()
    {
        return $this->hasMany(CheckOut::class);
    }

    public function guestType()
    {
        return $this->hasMany(GuestType::class);
    }

    public function nationality()
    {
        return $this->hasMany(Nationality::class);
    }

    public function geography()
    {
        return $this->hasMany(Geography::class);
    }

    public function country()
    {
        return $this->hasMany(Country::class);
    }

    public function meal()
    {
        return $this->hasMany(Meal::class);
    }
}
