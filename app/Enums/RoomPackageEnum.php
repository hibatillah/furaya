<?php

namespace App\Enums;

class RoomPackageEnum extends BaseEnum
{
    public const BED_BREAKFAST = 'bed and breakfast';
    public const HALF_BOARD = 'half board';
    public const FULL_BOARD = 'full board';
    public const HONEYMOON = 'honeymoon';
    public const FAMILY = 'family';
    public const ROMANTIC_GATEWAY = 'romantic gateway';
    public const BUSINESS_PACKAGE = 'business package';
    public const OTHER = 'other';

    protected static array $labels = [
        'Bed and Breakfast' => self::BED_BREAKFAST,
        'Half Board' => self::HALF_BOARD,
        'Full Board' => self::FULL_BOARD,
        'Honeymoon' => self::HONEYMOON,
        'Family' => self::FAMILY,
        'Romantic Gateway' => self::ROMANTIC_GATEWAY,
        'Business Package' => self::BUSINESS_PACKAGE,
        'Other' => self::OTHER,
    ];
}
