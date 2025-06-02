<?php

namespace App\Models;

class Department extends BaseModel
{
  protected $appends = [
    "employees_count",
    "can_delete",
  ];

  /**
   * Get the count of employees in the department
   * @return int
   */
  public function getEmployeesCountAttribute(): int
  {
    return Employee::where("department_id", $this->id)->count();
  }

  /**
   * Can delete if no employees in the department
   * @return bool
   */
  public function getCanDeleteAttribute(): bool
  {
    return $this->employees_count === 0;
  }
}
