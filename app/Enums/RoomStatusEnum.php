<?php

namespace App\Enums;

enum RoomStatusEnum: string
{
    case READY = 'ready';
    case BOOKED = 'booked';
    case CLEANING = 'cleaning';
    case MAINTENANCE = 'maintenance';
    case BOOKED_CLEANING = 'booked cleaning';
    case UNCLEAN = 'unclean';
    case BLOCKED = 'blocked';
    case UNRESERVED = 'unreserved';

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
