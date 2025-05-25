<?php

namespace App\Enums;

class VisitPurposeEnum extends BaseEnum
{
    public const VACATION = 'vacation';
    public const BUSINESS = 'business';
    public const STUDY = 'study';
    public const FAMILY = 'family';
    public const SEMINAR = 'seminar';
    public const OTHER = 'other';

    protected static array $labels = [
        'Vacation' => self::VACATION,
        'Business' => self::BUSINESS,
        'Study' => self::STUDY,
        'Family' => self::FAMILY,
        'Seminar' => self::SEMINAR,
        'Other' => self::OTHER,
    ];
}
