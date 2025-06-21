<?php

namespace Database\Seeders;

use App\Models\Rooms\BedType;
use App\Models\Rooms\Facility;
use App\Models\Rooms\Meal;
use App\Models\Rooms\RateType;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
  public function run()
  {
    // truncate existing data to avoid duplicates
    DB::table('bed_types')->truncate();
    DB::table('rate_types')->truncate();
    DB::table('room_types')->truncate();
    DB::table('facilities')->truncate();
    DB::table('meals')->truncate();
    DB::table('rooms')->truncate();

    // define initial facilities
    $facilities = ['Wifi', 'Televisi', "Kursi", "Meja", "Lemari", "Cermin", "Gantungan Baju", "Kulkas", "Brankas", "Handuk", "Sikat Gigi", "Selimut", "Bantal", "Pasta Gigi", "Gelas", "Pemanas Air", "Tissue", "Tempat Sampah", "Telepon Kabel", "AC", "Tirai Jendela", "Sabun", "Sampo", "Minibar",  "Sandal", "Hair Dryer", "Setrika", "Sofa", "Speaker"];

    // define initial bed types
    $bedTypes = ['Single', 'Double', 'Twin', 'Queen', 'King'];

    // define initial room types
    $roomTypes = ['Junior', 'Deluxe', 'Executive', 'Business', 'Furaya Suite'];

    // define initial meals
    $meals = ['Breakfast', 'Lunch', 'Dinner', 'All Inclusive', 'No Meal'];

    // insert seed data
    foreach ($facilities as $facility) {
      Facility::factory()->create([
        'name' => $facility,
      ]);
    }

    foreach ($bedTypes as $bedType) {
      BedType::factory()->create([
        'name' => $bedType,
      ]);
    }

    foreach ($meals as $meal) {
      Meal::factory()->create([
        'name' => $meal,
      ]);
    }

    // insert rate types first to include in room type factory
    RateType::factory()->count(5)->create();


    foreach ($roomTypes as $roomType) {
      RoomType::factory()->create([
        'name' => $roomType,
      ]);
    }

    // rooms using rate type id from room type
    Room::factory()->count(28)->create();
  }
}
