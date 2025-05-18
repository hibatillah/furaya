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
        DB::table('roles')->truncate();
        DB::table('bed_types')->truncate();
        DB::table('room_types')->truncate();

        // add initial user
        DB::table('users')->insert([
            'id' => 1,
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('haihaihai'),
        ]);

        // add default roles
        $roles = ['admin', 'manager', 'employee', 'customer'];

        foreach ($roles as $role) {
            DB::table('roles')->insert([
                'id' => Str::uuid(),
                'name' => $role,
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ]);
        }

        // add initial bed types
        $bedTypes = ['single', 'double', 'twin', 'queen', 'king'];

        foreach ($bedTypes as $bedType) {
            DB::table('bed_types')->insert([
                'id' => Str::uuid(),
                'name' => $bedType,
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ]);
        }

        // add initial room types
        $roomTypes = ['deluxe', 'executive', 'business', 'furaya suite'];

        foreach ($roomTypes as $roomType) {
            DB::table('room_types')->insert([
                'id' => Str::uuid(),
                'name' => $roomType,
                'capacity' => 2,
                'base_rate' => 100.00,
                'created_at' => $dateISO,
                'updated_at' => $dateISO,
            ]);
        }
    }
}
