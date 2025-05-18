<?php

namespace App\Enums;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case MANAGER = 'manager';
    case EMPLOYEE = 'employee';
    case CUSTOMER = 'customer';

    /**
     * Get the label for each enum case.
     *
     * @return array<string>
     */
    public static function getLabels(): array
    {
        return array_map(fn($case) => $case->name, self::cases());
    }

    /**
     * Get the status options for the room.
     *
     * @return array<string>
     */
    public static function getValues(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    /**
     * Get the status options for the room as key-value pairs.
     *
     * @return array<string, string>
     */
    public static function getPaired(): array
    {
        return array_combine(self::getLabels(), self::getValues());
    }
}
