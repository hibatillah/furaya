<?php

namespace Database\Seeders;

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

        // define initial bed types
        $bedTypes = ['Single', 'Double', 'Twin', 'Queen', 'King'];
        $bedTypesData = array_map(function ($bedType) use ($dateISO) {
            return [
                'id' => Str::uuid(),
                'name' => $bedType,
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ];
        }, $bedTypes);

        // define initial room types
        $roomTypes = ['Junior', 'Deluxe', 'Executive', 'Business', 'Furaya Suite'];
        $roomTypesData = array_map(function ($roomType) use ($dateISO) {
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
        DB::table('bed_types')->insert($bedTypesData);
        DB::table('room_types')->insert($roomTypesData);

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
        ];

        // insert user data
        DB::table('users')->insert($users);
    }
}
