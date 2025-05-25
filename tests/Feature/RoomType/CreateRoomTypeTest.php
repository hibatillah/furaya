<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

uses(RefreshDatabase::class);

test('Display create room type page', function () {
    // Create a user instance
    $user = User::factory()->create();

    // access the create room type page
    $response = $this
        ->actingAs($user)
        ->get('/tipe/kamar/tambah');

    // page loads successfully
    $response->assertOk();
});

test('Create new room type', function () {
    // Create a user instance
    $user = User::factory()->create();

    // submit a POST request to create a new room type
    $response = $this
        ->actingAs($user)
        ->post('/tipe/kamar/', [
            'name' => 'New Room Type',
            'capacity' => 2,
            'base_rate' => 300000,
        ]);

    // assert no validation errors and redirect
    $response
        ->assertRedirect('/tipe/kamar');

    // check that room type exists in the database
    $this->assertDatabaseHas('room_types', [
        'name' => 'New Room Type',
        'capacity' => 2,
        'base_rate' => 300000,
    ]);
});
