<?php

namespace App\Enums;

abstract class BaseEnum
{
  protected static array $labels = [];
  protected static array $values = [];

  /**
   * Get the label for each enum case.
   * @return array<string>
   */
  public static function getLabels(): array
  {
    return array_keys(static::$labels);
  }

  /**
   * Get the status options for the room.
   * @return array<string>
   */
  public static function getValues(): array
  {
    return array_values(static::$labels);
  }

  /**
   * Get the status options for the room as key-value pairs.
   * @return array<string, string>
   */
  public static function getKeyValues(): array
  {
    return static::$labels;
  }

  /**
   * Get the value for a given label.
   * @param string $label
   * @return string
   */
  public static function getValue(string $label): string
  {
    return array_search($label, static::$labels);
  }
}
