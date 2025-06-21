<?php

namespace App\Enums;

class SmokingTypeEnum extends BaseEnum
{
    public const SMOKING = 'smoking';
    public const NON_SMOKING = 'non-smoking';

    protected static array $labels = [
        'Smoking' => self::SMOKING,
        'Non Smoking' => self::NON_SMOKING,
    ];
}
