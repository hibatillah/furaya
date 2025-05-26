<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Utils\DateHelper;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $dateISO = DateHelper::getISO();

        // truncate existing data to avoid duplicates
        DB::table('users')->truncate();
        DB::table('roles')->truncate();
        DB::table('bed_types')->truncate();
        DB::table('room_types')->truncate();

        // define default roles
        $roles = ['Admin', 'Manager', 'Employee', 'Customer'];
        $roleData = array_map(function ($role) use ($dateISO) {
            return [
                'id' => Str::uuid(),
                'name' => $role,
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ];
        }, $roles);

        // define initial bed types
        $bedTypes = ['Single', 'Double', 'Twin', 'Queen', 'King'];
        $bedTypeData = array_map(function ($bedType) use ($dateISO) {
            return [
                'id' => Str::uuid(),
                'name' => $bedType,
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ];
        }, $bedTypes);

        // define initial room types
        $roomTypes = ['Junior', 'Deluxe', 'Executive', 'Business', 'Furaya Suite'];
        $roomTypeData = array_map(function ($roomType) use ($dateISO) {
            return [
                'id' => Str::uuid(),
                'name' => $roomType,
                'capacity' => 2,
                'base_rate' => 100.00,
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ];
        }, $roomTypes);

        // insert seed data
        DB::table('roles')->insert($roleData);
        DB::table('bed_types')->insert($bedTypeData);
        DB::table('room_types')->insert($roomTypeData);

        // define admin user
        $managerRoleId = Role::where('name', 'Manager')->first()->id;
        $adminRoleId = Role::where('name', 'Admin')->first()->id;

        $users = [
            [
                'name' => 'manager',
                'email' => 'manager@gmail.com',
                'password' => bcrypt('haihaihai'),
                'role_id' => $managerRoleId,
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ],
            [
                'name' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('haihaihai'),
                'role_id' => $adminRoleId,
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ],
        ];

        // insert user data
        DB::table('users')->insert($users);
    }
}
