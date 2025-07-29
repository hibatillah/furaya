<?php

namespace App\Models\Reservations;

use App\Enums\ReservationStatusEnum;
use App\Enums\RoomConditionEnum;
use App\Enums\StatusAccEnum;
use App\Models\BaseModel;
use App\Models\Managements\Employee;
use App\Models\Rooms\Room;
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
        $start_date = Carbon::parse($this->start_date);
        $end_date = Carbon::parse($this->end_date);

        $check_in_deadline = $end_date->copy()->setTime(11, 0);
        $check_out_deadline = $end_date->copy()->setTime(12, 0);
        $confirm_deadline = $start_date->copy()->addDay()->setTime(12, 0);

        // reject pending reservation if past the deadline
        if (
            $this->status_acc === StatusAccEnum::PENDING &&
            $now->gt($confirm_deadline)
        ) {
            $this->status_acc = StatusAccEnum::REJECTED;
            $this->status = ReservationStatusEnum::CANCELLED;
            $this->save();

            if ($this->reservationRoom?->room_id) {
                Room::where('id', $this->reservationRoom->room_id)
                    ->update([
                        'condition' => RoomConditionEnum::READY
                    ]);
            }

            return;
        }

        // if reservation is cancelled
        if ($this->cancelled_at) {
            $this->status = ReservationStatusEnum::CANCELLED;

            if ($this->reservationRoom?->room_id) {
                Room::where('id', $this->reservationRoom->room_id)
                    ->update([
                        'condition' => RoomConditionEnum::READY
                    ]);
            }

            // if guest is no show till check in deadline
        } elseif (!$this->checkIn && $now->gt($check_in_deadline)) {
            $this->status = ReservationStatusEnum::NO_SHOW;

            // if guest is checked in
        } elseif ($this->checkIn) {
            // if guest is not checked out till check out deadline
            if (!$this->checkOut && $now->gt($check_out_deadline)) {
                $this->status = ReservationStatusEnum::OVERDUE;
            } else {
                $this->status = ReservationStatusEnum::CHECKED_IN;
            }

            // if guest is checked out
        } elseif ($this->checkOut) {
            $this->status = ReservationStatusEnum::CHECKED_OUT;

            if ($this->reservationRoom?->room_id) {
                Room::where('id', $this->reservationRoom->room_id)
                    ->update([
                        'condition' => RoomConditionEnum::READY
                    ]);
            }
        }

        $this->save();
    }

    /**
     * modify reservation payment type
     */
    public function getPaymentTypeAttribute($value)
    {
        if (isset($value)) return $value;
        return $this->payment_method;
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
        return Carbon::parse($this->start_date)->translatedFormat('d M Y');
    }

    public function getFormattedEndDateAttribute()
    {
        return Carbon::parse($this->end_date)->translatedFormat('d M Y');
    }

    public function getFormattedCheckInAtAttribute()
    {
        if ($this->checkIn?->check_in_at) {
            return Carbon::parse($this->checkIn->check_in_at)
                ->translatedFormat('d M, H:i') . ' WIB';
        }

        return null;
    }

    public function getFormattedCheckOutAtAttribute()
    {
        if ($this->checkOut?->check_out_at) {
            return Carbon::parse($this->checkOut->check_out_at)
                ->translatedFormat('d M, H:i') . ' WIB';
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
