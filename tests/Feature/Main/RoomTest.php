<?php

use App\Enums\RoleEnum;
use App\Enums\RoomConditionEnum;
use App\Enums\RoomStatusEnum;
use App\Enums\SmokingTypeEnum;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomType;
use App\Models\User;
use Illuminate\Support\Str;
use function Pest\Laravel\{actingAs};
use Illuminate\Foundation\Testing\DatabaseTransactions;

uses(DatabaseTransactions::class);

beforeEach(function () {
    $this->admin = User::factory()->create([
        'role' => RoleEnum::ADMIN
    ]);

    $this->guest = User::factory()->create([
        'role' => RoleEnum::GUEST
    ]);

    $roomType = RoomType::all()->random();

    $this->roomData = [
        'room_number' => 1010,
        'floor_number' => 1,
        'view' => 'Sea View',
        'condition' => RoomConditionEnum::READY,
        'price' => 100000,
        'capacity' => $roomType->capacity,
        'size' => 25,
        'smoking_type' => SmokingTypeEnum::NON_SMOKING,
        'room_type_id' => $roomType->id,
        'bed_type_id' => $roomType->bed_type_id,
        'rate_type_id' => $roomType->rate_type_id,
        'status' => 'VC',
        'facilities' => $roomType->facility->pluck('id')->toArray(),
    ];
});

it('can create new room', function () {
    // create room
    actingAs($this->admin)
        ->post(route('room.store'), $this->roomData)
        ->assertRedirect();

    // check room has been created
    $room = Room::latest()->first();
    expect($room->room_number)->toBe($this->roomData['room_number']);
});

it('can change room status', function () {
    // create room
    $room = Room::factory()->create();

    // change room status
    actingAs($this->admin)
        ->put(route('room.update.status', $room->id), [
            'status' => RoomStatusEnum::OCC,
        ])
        ->assertRedirectBack();

    // check room status has been changed
    expect(Room::find($room->id)->status)->toBe(RoomStatusEnum::OCC);
});

it('can\'t create room as guest', function () {
    // create room as guest
    actingAs($this->guest)
        ->post(route('room.store'), $this->roomData)
        ->assertRedirectBack();

    // check room has not been created
    $room = Room::latest()->first();
    expect($room->room_number)->not->toBe($this->roomData['room_number']);
});

it('show error that `room_type_id` does not exist', function () {
    // create room
    actingAs($this->admin)
        ->post(route('room.store'), [
            ...$this->roomData,
            'room_type_id' => Str::uuid()
        ])
        ->assertRedirectBack()
        // check error message
        ->assertSessionHasErrors([
            'room_type_id' => 'Tipe kamar yang dipilih tidak ditemukan.'
        ]);
});
