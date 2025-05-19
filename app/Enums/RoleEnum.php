<?php

namespace App\Enums;

class RoleEnum extends BaseEnum
{
    public const ADMIN = 'admin';
    public const MANAGER = 'manager';
    public const EMPLOYEE = 'employee';
    public const CUSTOMER = 'customer';

    protected static array $labels = [
        'ADMIN' => self::ADMIN,
        'MANAGER' => self::MANAGER,
        'EMPLOYEE' => self::EMPLOYEE,
        'CUSTOMER' => self::CUSTOMER,
    ];
}
