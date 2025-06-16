<?php

namespace App\Models\Managements;

use App\Models\BaseModel;

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

  /** table relations */
  public function employee()
  {
    return $this->hasMany(Employee::class);
  }
}
