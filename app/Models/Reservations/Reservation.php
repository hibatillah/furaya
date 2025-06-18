<?php

namespace App\Models\Reservations;

use App\Models\BaseModel;
use App\Models\Managements\Employee;
use Carbon\Carbon;

class Reservation extends BaseModel
{
    protected $appends = [
        'formatted_start_date',
        'formatted_end_date',
    ];

    public function getFormattedStartDateAttribute()
    {
        return Carbon::parse($this->start_date)->translatedFormat('j F Y');
    }

    public function getFormattedEndDateAttribute()
    {
        return Carbon::parse($this->end_date)->translatedFormat('j F Y');
    }

    /**
     * table relations
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function reservationGuest()
    {
        return $this->hasOne(ReservationGuest::class, "reservation_id");
    }

    public function reservationRoom()
    {
        return $this->hasOne(ReservationRoom::class, "reservation_id");
    }

    public function reservationTransaction()
    {
        return $this->hasOne(ReservationTransaction::class);
    }

    public function checkIn()
    {
        return $this->hasOne(CheckIn::class);
    }

    public function checkOut()
    {
        return $this->hasOne(CheckOut::class);
    }
}
