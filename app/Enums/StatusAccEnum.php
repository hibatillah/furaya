<?php

namespace App\Enums;

class StatusAccEnum extends BaseEnum
{
    public const PENDING = 'pending';
    public const APPROVED = 'approved';
    public const REJECTED = 'rejected';

    protected static array $labels = [
        'Pending' => self::PENDING,
        'Approved' => self::APPROVED,
        'Rejected' => self::REJECTED,
    ];
}
