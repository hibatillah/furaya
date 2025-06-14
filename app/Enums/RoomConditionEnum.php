<?php

namespace App\Enums;

class RoomConditionEnum extends BaseEnum
{
    // ready
    public const READY = 'ready';
    public const CLEANING = 'cleaning';
    public const MAINTENANCE = 'maintenance';
    public const UNCLEAN = 'unclean';
    public const BLOCKED = 'blocked';
    public const UNRESERVED = 'unreserved';

    // booked
    public const BOOKED = 'booked';
    public const BOOKED_CLEANING = 'booked cleaning';

    protected static array $labels = [
        'READY' => self::READY,
        'CLEANING' => self::CLEANING,
        'MAINTENANCE' => self::MAINTENANCE,
        'UNCLEAN' => self::UNCLEAN,
        'BLOCKED' => self::BLOCKED,
        'UNRESERVED' => self::UNRESERVED,
        'BOOKED' => self::BOOKED,
        'BOOKED_CLEANING' => self::BOOKED_CLEANING,
    ];
}
