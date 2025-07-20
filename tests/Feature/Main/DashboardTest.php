<?php

use function Pest\Laravel\{actingAs};

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;

uses(DatabaseTransactions::class);

beforeEach(function () {
    $this->employee = User::factory()->create([
        'role' => RoleEnum::EMPLOYEE
    ]);

    $this->guest = User::factory()->create([
        'role' => RoleEnum::GUEST
    ]);
});

test('authorized users can visit the dashboard', function () {
    actingAs($this->employee)
        ->get(route('dashboard'))
        ->assertOk();
});

test('unauthorized users are redirected to the home page', function () {
    actingAs($this->guest)
        ->get(route('dashboard'))
        ->assertRedirect(route('home'))
        ->assertSessionHas('warning', 'Anda tidak memiliki akses');
});
