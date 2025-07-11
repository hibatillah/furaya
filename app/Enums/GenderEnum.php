<?php

namespace App\Enums;

class GenderEnum extends BaseEnum
{
    public const MALE = 'male';
    public const FEMALE = 'female';

    protected static array $labels = [
        'Male' => self::MALE,
        'Female' => self::FEMALE,
    ];
}
