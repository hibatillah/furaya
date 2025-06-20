<?php

namespace App\Enums;

use App\Enums\BaseEnum;

class ReservationStatusEnum extends BaseEnum
{
    // progress reservation status
    const PENDING = "pending";
    const BOOKED = "booked";
    const CHECKED_IN = "checked in";

    // finished reservation status
    const CHECKED_OUT = "checked out";
    const NO_SHOW = "no show";
    const CANCELLED = "cancelled";
    const OVERDUE = "overdue";

    protected static array $labels = [
        "PENDING" => self::PENDING,
        "BOOKED" => self::BOOKED,
        "CHECKED_IN" => self::CHECKED_IN,
        "CHECKED_OUT" => self::CHECKED_OUT,
        "NO_SHOW" => self::NO_SHOW,
        "CANCELLED" => self::CANCELLED,
        "OVERDUE" => self::OVERDUE,
    ];
}
