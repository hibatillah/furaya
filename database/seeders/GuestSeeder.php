<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Guests\Country;
use App\Models\Guests\Geography;
use App\Models\Guests\Guest;
use App\Models\Reservations\GuestType;
use App\Models\Guests\Nationality;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GuestSeeder extends Seeder
{
  public function run()
  {
    // truncate existing data to avoid duplicates
    DB::table('guest_types')->truncate();
    DB::table('countries')->truncate();
    DB::table('geographies')->truncate();
    DB::table('nationalities')->truncate();

    // define data options
    $guestTypes = ["vip", "regular", "business man", "family", "couple", "single", "group", "other"];
    $countries = ["indonesia", "singapore", "malaysia", "thailand", "vietnam", "philippines", "india", "china", "japan", "korea", "usa", "australia", "new zealand"];

    // seed data
    foreach ($guestTypes as $guestType) {
      GuestType::factory()->create([
        "name" => $guestType,
      ]);
    }

    foreach ($countries as $country) {
      Country::factory()->create([
        "name" => $country,
      ]);
    }

    foreach ($countries as $country) {
      Geography::factory()->create([
        "name" => $country,
      ]);
    }

    foreach ($countries as $country) {
      Nationality::factory()->create([
        "name" => $country,
      ]);
    }

    // create guest data from existing user with guest role
    $users = User::where("role", RoleEnum::GUEST)->get();

    foreach ($users as $user) {
      Guest::factory()->create([
        "user_id" => $user->id,
      ]);
    }
  }
}
