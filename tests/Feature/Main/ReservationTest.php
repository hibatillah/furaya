<?php

use function Pest\Laravel\{actingAs};

use App\Enums\BookingTypeEnum;
use App\Enums\GenderEnum;
use App\Enums\PaymentEnum;
use App\Enums\RoleEnum;
use App\Enums\RoomPackageEnum;
use App\Enums\SmokingTypeEnum;
use App\Enums\StatusAccEnum;
use App\Enums\VisitPurposeEnum;
use App\Models\Guests\Guest;
use App\Models\Managements\Employee;
use App\Models\Reservations\Reservation;
use App\Models\Reservations\ReservationGuest;
use App\Models\Reservations\ReservationRoom;
use App\Models\Reservations\ReservationTransaction;
use App\Models\Rooms\Room;
use App\Models\Rooms\RoomType;
use App\Models\User;
use App\Services\ReservationService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Carbon\Carbon;

uses(DatabaseTransactions::class);

beforeEach(function () {
    $this->reservationDataService = new ReservationService();

    $this->guest = User::factory()->create([
        'role' => RoleEnum::GUEST
    ]);

    $this->employeeUser = User::factory()->create([
        'role' => RoleEnum::EMPLOYEE
    ]);
    $this->employee = Employee::factory()->create([
        'user_id' => $this->employeeUser->id
    ]);

    $roomType = RoomType::factory()->create([
        'name' => 'Suite',
    ]);
    $this->room = Room::factory()->create([
        'room_type_id' => $roomType->id,
    ]);

    $guest = Guest::with('user')->inRandomOrder()->first();

    $this->reservationData = [
        'start_date' => Carbon::today()->translatedFormat('Y-m-d'),
        'end_date' => Carbon::tomorrow()->translatedFormat('Y-m-d'),
        'length_of_stay' => 2,
        'adults' => 2,
        'pax' => 2,
        'children' => 0,
        'total_price' => 300000,
        'arrival_from' => 'Indonesia',
        'employee_name' => $this->employee->name,
        'employee_id' => $this->employee->id,
        'booking_type' => BookingTypeEnum::ONLINE,
        'visit_purpose' => VisitPurposeEnum::VACATION,
        'room_package' => RoomPackageEnum::FAMILY,
        'payment_method' => PaymentEnum::CASH,
        'status_acc' => StatusAccEnum::APPROVED,
        'smoking_type' => SmokingTypeEnum::NON_SMOKING,
        'advance_amount' => 100000,
        'advance_remarks' => 'Advance',

        'name' => $guest->user->name,
        'email' => $guest->user->email,
        'phone' => $guest->phone,
        'gender' => GenderEnum::MALE,
        'birthdate' => $guest->birthdate,
        'country' => 'Indonesia',

        'room_id' => $this->room->id,
        'room_type_id' => $roomType->id,
        'room_type_name' => $roomType->name,
    ];
});

it('can create a reservation as employee', function () {
    // get reservation count before create the new one
    $countBefore = Reservation::count();

    // create reservation
    actingAs($this->employeeUser)
        ->post(route('reservation.store'), $this->reservationData)
        ->assertRedirect();

    // check reservation count has been increased by 1
    expect(Reservation::count())->toBe($countBefore + 1);
});

it('can create a reservation as guest', function () {
    // get reservation count before create the new one
    $countBefore = Reservation::count();

    // create reservation
    actingAs($this->guest)
        ->post(route('public.reservation.store'), $this->reservationData)
        ->assertRedirect();

    // check reservation count has been increased by 1
    expect(Reservation::count())->toBe($countBefore + 1);
});

it('can check-in inside reservation date range', function () {
    // create reservation
    $reservation = Reservation::factory()
        ->has(ReservationGuest::factory()->count(1))
        ->has(ReservationRoom::factory()->count(1))
        ->has(ReservationTransaction::factory()->count(1))
        ->create([
            'start_date' => Carbon::today()->format('Y-m-d'),
            'end_date' => Carbon::tomorrow()->format('Y-m-d'),
        ]);

    // check-in inside reservation date range
    actingAs($this->employeeUser)
        ->post(route('checkin.store'), [
            'reservation_id' => $reservation->id,
            'check_in_at' => Carbon::today()->endOfDay()->format('Y-m-d'),
            'check_in_by' => $this->employee->name,
            'employee_id' => $this->employee->id,
        ])
        ->assertRedirect();
});

it('can check-out after check-in', function () {
    // create reservation
    $reservation = Reservation::factory()
        ->has(ReservationGuest::factory()->count(1))
        ->has(ReservationRoom::factory()->count(1))
        ->has(ReservationTransaction::factory()->count(1))
        ->create([
            'start_date' => Carbon::today()->format('Y-m-d'),
            'end_date' => Carbon::tomorrow()->format('Y-m-d'),
        ]);

    // check-out after check-in
    actingAs($this->employeeUser)
        ->post(route('checkout.store'), [
            'reservation_id' => $reservation->id,
            'check_out_at' => Carbon::tomorrow()->setTime(10, 0)->format('Y-m-d'),
            'check_out_by' => $this->employee->name,
            'employee_id' => $this->employee->id,
        ])
        ->assertRedirect();
});

it('can check guest by phone number for reservation form', function () {
    // create new guest
    $guest = Guest::factory()
        ->for(User::factory()->create([
            'role' => RoleEnum::GUEST
        ]))
        ->create([
            'nik_passport' => uniqid('pass_', true),
            'phone' => fake()->unique()->phoneNumber,
        ]);

    // check guest by phone number
    actingAs($this->employeeUser)
        ->get(route('reservation.guest', [
            'phone' => $guest->phone
        ]))
        ->assertJson([
            'guest' => Guest::with('user')
                ->where('phone', $guest->phone)
                ->first()
                ->toArray()
        ]);
});

it('can\'t create a reservation with `end_date` earlier than `start_date`', function () {
    // create reservation
    actingAs($this->employeeUser)
        ->post(route('reservation.store'), [
            ...$this->reservationData,
            'end_date' => Carbon::yesterday()->format('Y-m-d'),
        ])
        // check error message
        ->assertSessionHasErrors([
            'end_date' => 'Tanggal check-out harus setelah tanggal check-in.'
        ]);
});

it('can\'t check-in outside reservation date range', function () {
    // create reservation
    $reservation = Reservation::factory()
        ->has(ReservationGuest::factory()->count(1))
        ->has(ReservationRoom::factory()->count(1))
        ->has(ReservationTransaction::factory()->count(1))
        ->create([
            'start_date' => Carbon::today()->format('Y-m-d'),
            'end_date' => Carbon::tomorrow()->format('Y-m-d'),
        ]);

    // check-in outside reservation date range
    actingAs($this->employeeUser)
        ->post(route('checkin.store'), [
            'reservation_id' => $reservation->id,
            'check_in_at' => Carbon::today()->addDays(7)->format('Y-m-d'),
            'check_in_by' => $this->employee->name,
            'employee_id' => $this->employee->id,
        ])
        // check error message
        ->assertSessionHasErrors([
            'check_in_at' => 'Check-in tidak dapat dilakukan di luar tanggal reservasi.'
        ]);
});

it('can\'t check-out outside reservation date range', function () {
    // create reservation
    $reservation = Reservation::factory()
        ->has(ReservationGuest::factory()->count(1))
        ->has(ReservationRoom::factory()->count(1))
        ->has(ReservationTransaction::factory()->count(1))
        ->create([
            'start_date' => Carbon::today()->format('Y-m-d'),
            'end_date' => Carbon::tomorrow()->format('Y-m-d'),
        ]);

    // create reservation check-in
    actingAs($this->employeeUser)
        ->post(route('checkin.store'), [
            'reservation_id' => $reservation->id,
            'check_in_at' => Carbon::today()->endOfDay()->format('Y-m-d'),
            'check_in_by' => $this->employee->name,
            'employee_id' => $this->employee->id,
        ]);

    // check-out outside reservation date range
    actingAs($this->employeeUser)
        ->post(route('checkout.store'), [
            'reservation_id' => $reservation->id,
            'check_out_at' => Carbon::yesterday()->format('Y-m-d'),
            'check_out_by' => $this->employee->name,
            'employee_id' => $this->employee->id,
        ])
        // check error message
        ->assertSessionHasErrors([
            'check_out_at' => 'Check-out tidak dapat dilakukan di luar tanggal reservasi.'
        ]);
});

it('can\'t check-out without check-in', function () {
    // create reservation
    $reservation = Reservation::factory()
        ->has(ReservationGuest::factory()->count(1))
        ->has(ReservationRoom::factory()->count(1))
        ->has(ReservationTransaction::factory()->count(1))
        ->create([
            'start_date' => Carbon::today()->format('Y-m-d'),
            'end_date' => Carbon::tomorrow()->format('Y-m-d'),
        ]);

    // check-out without check-in
    actingAs($this->employeeUser)
        ->post(route('checkout.store'), [
            'reservation_id' => $reservation->id,
            'check_out_at' => Carbon::tomorrow()->setTime(10, 0)->format('Y-m-d'),
            'check_out_by' => $this->employee->name,
            'employee_id' => $this->employee->id,
        ])
        // check error message
        ->assertSessionHasErrors([
            'check_out_at' => 'Check-in terlebih dahulu sebelum melakukan check-out.'
        ]);
});
