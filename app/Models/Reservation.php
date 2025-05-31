<?php

namespace App\Models;

use Carbon\Carbon;

class Reservation extends BaseModel
{
    protected $appends = [
        'formatted_total_price',
        'formatted_created_at',
        'formatted_check_in',
        'formatted_check_out',
    ];

    public function getFormattedTotalPriceAttribute()
    {
        return number_format($this->total_price, 0, ',', '.');
    }

    public function getFormattedCheckInAttribute()
    {
        if (!$this->check_in) return "-";
        return Carbon::parse($this->check_in)->translatedFormat('j F, Y');
    }

    public function getFormattedCheckOutAttribute()
    {
        if (!$this->check_out) return "-";
        return Carbon::parse($this->check_out)->translatedFormat('j F, Y');
    }

    public function getFormattedCreatedAtAttribute()
    {
        return Carbon::parse($this->created_at)->translatedFormat('j F, Y');
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
