<?php

namespace App\Enums;

class BookingTypeEnum extends BaseEnum
{
    public const DIRECT = 'direct';
    public const ONLINE = 'online';
    public const WALK_IN = 'walk in';
    public const TRAVEL = "travel";
    public const OTHER = 'other';

    protected static array $labels = [
        'Direct' => self::DIRECT,
        'Online' => self::ONLINE,
        'Walk In' => self::WALK_IN,
        'Travel Agent' => self::TRAVEL,
        'Other' => self::OTHER,
    ];
}
