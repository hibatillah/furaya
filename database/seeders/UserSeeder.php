<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Managements\Department;
use App\Models\Managements\Employee;
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
    DB::table('guests')->truncate();
    DB::table('employees')->truncate();
    DB::table('departments')->truncate();
    DB::table('users')->truncate();

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

    // create employees data
    foreach (range(1, 3) as $i) {
      $employeeUser = User::create([
        'name' => 'employee' . $i,
        'email' => 'employee' . $i . '@gmail.com',
        'password' => $password,
        'role' => RoleEnum::EMPLOYEE,
      ]);

      Employee::factory()->create([
        'user_id' => $employeeUser->id,
        'department_id' => $department->id,
      ]);
    }

    // create user data as guest
    User::factory()->count(10)->sequence(fn($sequence) => [
      'email' => "guest{$sequence->index}@gmail.com",
      'password' => $password,
      'role' => RoleEnum::GUEST,
    ])->create();
  }
}
