<?php

namespace App\Enums;

class RoomStatusEnum extends BaseEnum
{
    public const OCC = "Occupied";
    public const VC = "Vacant";
    public const HU = "House Use";
    public const OO = "Out of Order";
    public const CO = "Check Out";
    public const CI = "Check In";
    public const CIP = "Check In Pagi";
    public const PDU = "Part Day Use";
    public const DU = "Day Use";
    public const ONL = "OCC No Luggage";
    public const SO = "Sleep Out";
    public const DD = "Do Not Disturb";

    protected static array $labels = [
        'OCC' => self::OCC,
        'VC' => self::VC,
        'HU' => self::HU,
        'OO' => self::OO,
        'CO' => self::CO,
        'CI' => self::CI,
        'CIP' => self::CIP,
        'PDU' => self::PDU,
        'DU' => self::DU,
        'ONL' => self::ONL,
        'SO' => self::SO,
        'DD' => self::DD,
    ];
}
