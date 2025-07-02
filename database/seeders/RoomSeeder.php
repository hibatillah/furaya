<?php

namespace Database\Seeders;

use App\Models\Rooms\BedType;
use App\Models\Rooms\Facility;
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
    DB::table('rooms')->truncate();

    // define initial facilities
    $facilities = ['Wifi', 'Televisi', "Kursi", "Meja", "Lemari", "Cermin", "Gantungan Baju", "Kulkas", "Brankas", "Handuk", "Sikat Gigi", "Selimut", "Bantal", "Pasta Gigi", "Gelas", "Pemanas Air", "Tissue", "Tempat Sampah", "Telepon Kabel", "AC", "Tirai Jendela", "Sabun", "Sampo", "Minibar",  "Sandal", "Hair Dryer", "Setrika", "Sofa", "Speaker"];

    // define initial bed types
    $bedTypes = ['Single', 'Double', 'Twin', 'Queen', 'King'];

    // define initial room types
    $roomTypes = [
      [
        'name' => 'Deluxe',
        'images' => ["room_types/deluxe.jpg"],
      ],
      [
        'name' => 'Executive',
        'images' => ["room_types/executive.jpg"],
      ],
      [
        'name' => 'Business',
        'images' => ["room_types/business.jpg"],
      ],
      [
        'name' => 'Junior Suite',
        'images' => ["room_types/executive.jpg"],
      ],
      [
        'name' => 'Furaya Suite',
        'images' => ["room_types/business.jpg"],
      ],
    ];

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

    // insert rate types first to include in room type factory
    RateType::factory()->count(5)->create();


    foreach ($roomTypes as $roomType) {
      RoomType::factory()->create([
        'name' => $roomType['name'],
        'images' => $roomType['images'],
      ]);
    }

    // rooms using rate type id from room type
    Room::factory()->count(50)->create();
  }
}
