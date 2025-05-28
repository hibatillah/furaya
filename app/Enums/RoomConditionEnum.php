<?php

namespace App\Enums;

class RoomConditionEnum extends BaseEnum
{
    public const READY = 'ready';
    public const BOOKED = 'booked';
    public const CLEANING = 'cleaning';
    public const MAINTENANCE = 'maintenance';
    public const BOOKED_CLEANING = 'booked cleaning';
    public const UNCLEAN = 'unclean';
    public const BLOCKED = 'blocked';
    public const UNRESERVED = 'unreserved';

    protected static array $labels = [
        'READY' => self::READY,
        'BOOKED' => self::BOOKED,
        'CLEANING' => self::CLEANING,
        'MAINTENANCE' => self::MAINTENANCE,
        'BOOKED_CLEANING' => self::BOOKED_CLEANING,
        'UNCLEAN' => self::UNCLEAN,
        'BLOCKED' => self::BLOCKED,
        'UNRESERVED' => self::UNRESERVED,
    ];
}
