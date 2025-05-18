<?php

namespace App\Utils;

use Carbon\Carbon;

class DateHelper extends Carbon
{
    public static function getISO(): string
    {
        return self::now()->toIso8601String();
    }
}
