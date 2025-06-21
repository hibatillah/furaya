<?php

namespace App\Enums;

class ReservationTransactionEnum extends BaseEnum
{
    public const BOOKING = "booking";
    public const DEPOSIT = "deposit";
    public const CHARGE = "charge";
    public const REFUND = "refund";
    public const DISCOUNT = "discount";

    protected static array $labels = [
        "BOOKING" => self::BOOKING,
        "DEPOSIT" => self::DEPOSIT,
        "CHARGE" => self::CHARGE,
        "REFUND" => self::REFUND,
        "DISCOUNT" => self::DISCOUNT,
    ];
}
