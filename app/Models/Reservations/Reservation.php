<?php

namespace App\Models\Reservations;

use App\Models\BaseModel;
use App\Models\Managements\Employee;
use Carbon\Carbon;

class Reservation extends BaseModel
{
    protected $appends = [
        'check_in',
        'check_out',
        'is_check_in',
        'is_check_out',
        'room_status',
        'formatted_check_in',
        'formatted_check_out',
        'formatted_created_at',
        'formatted_updated_at',
    ];

    public function getCheckInAttribute()
    {
        return CheckIn::where('reservation_id', $this->id)->first();
    }

    public function getCheckOutAttribute()
    {
        return CheckOut::where('reservation_id', $this->id)->first();
    }

    public function getIsCheckInAttribute()
    {
        return $this->check_in->checked_in_at !== null;
    }

    public function getIsCheckOutAttribute()
    {
        return $this->check_out->checked_out_at !== null;
    }

    public function getRoomStatusAttribute()
    {
        return $this->room->room_status;
    }

    public function getFormattedCheckInAttribute()
    {
        if (!$this->is_check_in) return "-";
        return Carbon::parse($this->check_in->checked_in_at)->translatedFormat('j F, Y H:i');
    }

    public function getFormattedCheckOutAttribute()
    {
        if (!$this->is_check_out) return "-";
        return Carbon::parse($this->check_out->checked_out_at)->translatedFormat('j F, Y');
    }

    public function getFormattedCreatedAtAttribute()
    {
        return Carbon::parse($this->created_at)->translatedFormat('j F Y H:i');
    }

    public function getFormattedUpdatedAtAttribute()
    {
        return Carbon::parse($this->updated_at)->translatedFormat('j F Y H:i');
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
        return $this->hasOne(ReservationGuest::class);
    }

    public function reservationRoom()
    {
        return $this->hasOne(ReservationRoom::class);
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
