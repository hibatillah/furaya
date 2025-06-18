<?php

namespace Database\Seeders;

use App\Enums\GenderEnum;
use App\Enums\RoleEnum;
use App\Models\Managements\Department;
use App\Models\User;
use App\Utils\DateHelper;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
  public function run()
  {
    $dateISO = DateHelper::getISO();
    $password = bcrypt('haihaihai');

    // truncate existing data to avoid duplicates
    DB::table('users')->truncate();
    DB::table('employees')->truncate();
    DB::table('departments')->truncate();

    // define user data
    $users = [
      [
        'name' => 'manager',
        'email' => 'manager@gmail.com',
        'password' => $password,
        'role' => RoleEnum::MANAGER,
        'created_at' => $dateISO,
        'updated_at' => $dateISO,
      ],
      [
        'name' => 'admin',
        'email' => 'admin@gmail.com',
        'password' => $password,
        'role' => RoleEnum::ADMIN,
        'created_at' => $dateISO,
        'updated_at' => $dateISO,
      ],
    ];

    DB::table('users')->insert($users);

    // define employee user data
    $department = Department::create([
      'name' => 'Front Desk',
    ]);

    $employee = User::create([
      'name' => 'employee',
      'email' => 'employee@gmail.com',
      'password' => $password,
      'role' => RoleEnum::EMPLOYEE,
    ]);

    $employee->employee()->create([
      'department_id' => $department->id,
      'gender' => GenderEnum::MALE,
      'hire_date' => $dateISO,
    ]);

    // create user data as guest
    User::factory()->count(10)->create([
      'password' => $password,
      'role' => RoleEnum::GUEST,
    ]);
  }
}
