<?php

namespace Database\Seeders;

use App\Enums\GenderEnum;
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
        DB::table('bed_types')->truncate();
        DB::table('room_types')->truncate();
        DB::table('departments')->truncate();
        DB::table('employees')->truncate();

        // define initial bed types
        $bedTypeOptions = ['Single', 'Double', 'Twin', 'Queen', 'King'];
        $bedTypes = array_map(function ($bedType) use ($dateISO) {
            return [
                'id' => Str::uuid(),
                'name' => $bedType,
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ];
        }, $bedTypeOptions);

        // define initial room types
        $roomTypeOptions = ['Junior', 'Deluxe', 'Executive', 'Business', 'Furaya Suite'];
        $roomTypes = array_map(function ($roomType) use ($dateISO) {
            return [
                'id' => Str::uuid(),
                'name' => $roomType,
                'capacity' => 2,
                'base_rate' => 100.00,
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ];
        }, $roomTypeOptions);

        // add department data
        $department = [
            'id' => Str::uuid(),
            'name' => 'Front Desk',
            'created_at' => $dateISO,
            'updated_at' => $dateISO,
        ];

        // insert seed data
        DB::table('bed_types')->insert($bedTypes);
        DB::table('room_types')->insert($roomTypes);
        DB::table('departments')->insert($department);

        // define admin user
        $password = bcrypt('haihaihai');

        $users = [
            [
                'name' => 'manager',
                'email' => 'manager@gmail.com',
                'password' => $password,
                'role' => 'manager',
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ],
            [
                'name' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => $password,
                'role' => 'admin',
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ],
            [
                'name' => 'employee',
                'email' => 'employee@gmail.com',
                'password' => $password,
                'role' => 'employee',
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ],
            [
                'name' => 'customer',
                'email' => 'customer@gmail.com',
                'password' => $password,
                'role' => 'customer',
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ],
        ];

        // insert user data
        DB::table('users')->insert($users);

        // add employee user reference to employee table
        DB::table('employees')->insert([
            'id' => Str::uuid(),
            'user_id' => 3,
            'department_id' => $department['id'],
            'gender' => GenderEnum::MALE,
            'hire_date' => $dateISO,
            'created_at' => $dateISO,
            'updated_at' => $dateISO,
        ]);

        // add customer user reference to customer table
        DB::table('customers')->insert([
            'id' => Str::uuid(),
            'user_id' => 4,
            'nik_passport' => '1234567890',
            'gender' => GenderEnum::MALE,
            'birthdate' => $dateISO,
            'phone' => '081234567890',
            'profession' => 'Software Engineer',
            'nationality' => 'Indonesia',
            'created_at' => $dateISO,
            'updated_at' => $dateISO,
        ]);
    }
}
