<?php

namespace Database\Seeders;

use App\Models\Rooms\RoomFacility;
use App\Models\Rooms\RoomTypeFacility;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacilitySeeder extends Seeder
{
  public function run()
  {
    // truncate existing data to avoid duplicates
    DB::table('room_type_facilities')->truncate();
    DB::table('room_facilities')->truncate();

    // add facilities to rooms data
    RoomTypeFacility::factory()->count(12)->create();
    RoomFacility::factory()->count(10)->create();
  }
}
