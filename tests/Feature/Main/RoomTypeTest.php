<?php

use App\Enums\RoleEnum;
use App\Models\Rooms\BedType;
use App\Models\Rooms\Facility;
use App\Models\Rooms\RateType;
use App\Models\Rooms\RoomType;
use App\Models\User;
use function Pest\Laravel\{actingAs, post};
use Illuminate\Foundation\Testing\DatabaseTransactions;

uses(DatabaseTransactions::class);

beforeEach(function () {
    $this->admin = User::factory()->create([
        'role' => RoleEnum::ADMIN
    ]);

    $this->guest = User::factory()->create([
        'role' => RoleEnum::GUEST
    ]);

    $this->roomTypeData = [
        'code' => 'DLX',
        'name' => 'Deluxe Suite',
        'capacity' => 2,
        'base_rate' => 100000,
        'size' => 100,
        'rate_type_id' => RateType::all()->random()->id,
        'bed_type_id' => BedType::all()->random()->id,
        'facilities' => Facility::inRandomOrder()->limit(2)->pluck('id')->toArray(),
    ];
});

it('can create new room type', function () {
    // create room type
    actingAs($this->admin)
        ->post(route('roomtype.store'), $this->roomTypeData)
        ->assertRedirect(route('roomtype.index'))
        ->assertSessionHas('success');

    // check room type has been created
    $roomType = RoomType::latest()->first();
    expect($roomType->name)->toBe($this->roomTypeData['name']);
});

it('can\'t create room types as guest', function () {
    // create room type as guest
    actingAs($this->guest)
        ->post(route('roomtype.store'), $this->roomTypeData)
        ->assertRedirectBack();

    // check room type has not been created
    $roomType = RoomType::latest()->first();
    expect($roomType->name)->not->toBe($this->roomTypeData['name']);
});

it('show error that `code` exceeds max length', function () {
    // create room type
    actingAs($this->admin)
        ->post(route('roomtype.store'), [
            ...$this->roomTypeData,
            'code' => 'DLX123456'   // max 5 characters
        ])
        ->assertRedirectBack()
        // check error message
        ->assertSessionHasErrors([
            'code' => 'Kode tipe kamar maksimal 5 karakter.'
        ]);
});
