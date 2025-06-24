<?php

namespace App\Models\Reservations;

use App\Enums\ReservationStatusEnum;
use App\Models\BaseModel;
use App\Models\Managements\Employee;
use Carbon\Carbon;

class Reservation extends BaseModel
{
    /**
     * Update reservation status
     * based on the current date time and condition
     */
    public function updateReservationStatus()
    {
        $now = now();
        $check_in_deadline = Carbon::parse($this->end_date)
            ->copy()->setTime(12, 0);
        $check_out_deadline = Carbon::parse($this->end_date)
            ->copy()->setTime(13, 0);

        if ($this->cancelled_at) {
            $this->status = ReservationStatusEnum::CANCELLED;
        } else if (!$this->checkIn && $now->gt($check_in_deadline)) {
            $this->status = ReservationStatusEnum::NO_SHOW;
        } else if ($this->checkIn) {
            if (!$this->checkOut && $now->gt($check_out_deadline)) {
                $this->status = ReservationStatusEnum::OVERDUE;
            } else {
                $this->status = ReservationStatusEnum::CHECKED_IN;
            }
        } else if ($this->checkOut) {
            $this->status = ReservationStatusEnum::CHECKED_OUT;
        }

        $this->save();
    }

    /**
     * appends custom attributes
     */
    protected $appends = [
        'is_finished',
        'formatted_start_date',
        'formatted_end_date',
        'formatted_check_in_at',
        'formatted_check_out_at',
    ];

    public function getIsFinishedAttribute()
    {
        $status = in_array($this->status, [
            ReservationStatusEnum::CHECKED_OUT,
            ReservationStatusEnum::NO_SHOW,
            ReservationStatusEnum::CANCELLED,
            ReservationStatusEnum::OVERDUE,
        ]);

        $deadline = Carbon::parse($this->end_date)
            ->copy()->setTime(13, 0);

        $overdue = Carbon::today()->gt($deadline);

        $is_finished = $status || $overdue;

        return $is_finished;
    }

    public function getFormattedStartDateAttribute()
    {
        return Carbon::parse($this->start_date)->translatedFormat('j F Y');
    }

    public function getFormattedEndDateAttribute()
    {
        return Carbon::parse($this->end_date)->translatedFormat('j F Y');
    }

    public function getFormattedCheckInAtAttribute()
    {
        if ($this->checkIn?->check_in_at) {
            return Carbon::parse($this->checkIn->check_in_at)
                ->translatedFormat('d M Y, H:i') . ' WIB';
        }

        return null;
    }

    public function getFormattedCheckOutAtAttribute()
    {
        if ($this->checkOut?->check_out_at) {
            return Carbon::parse($this->checkOut->check_out_at)
                ->translatedFormat('d M Y H:i') . ' WIB';
        }

        return null;
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
        return $this->hasMany(ReservationTransaction::class);
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
