<?php

namespace Database\Factories\Reservations;

use App\Enums\BookingTypeEnum;
use App\Enums\PaymentEnum;
use App\Enums\ReservationStatusEnum;
use App\Enums\RoomPackageEnum;
use App\Enums\StatusAccEnum;
use App\Enums\VisitPurposeEnum;
use App\Models\Managements\Employee;
use App\Models\Reservations\GuestType;
use App\Models\Rooms\Room;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservations\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $room = Room::all()->random();
        $startDate = Carbon::instance(
            $this->faker->dateTimeBetween('-7 day', '+1 month')
        );
        $endDate = $startDate->copy()->addDays(
            $this->faker->numberBetween(1, 3)
        );
        $lengthOfStay = $startDate->diffInDays($endDate);

        $adults = $this->faker->numberBetween(1, 3);
        $children = $this->faker->numberBetween(0, 2);
        $pax = $adults + $children;

        $employee = Employee::with('user')->get()->random();

        return [
            "start_date" => $startDate->format("Y-m-d"),
            "end_date" => $endDate->format("Y-m-d"),
            "booking_number" => $this->faker
                ->unique()
                ->numberBetween(100000, 999999),
            "arrival_from" => $this->faker->city,
            "children" => $children,
            "adults" => $adults,
            "pax" => $pax,
            "length_of_stay" => $lengthOfStay,
            "total_price" => $room->price * $pax * $lengthOfStay,
            "guest_type" => GuestType::all()->random()->name,
            "employee_name" => $employee->user->name,
            "employee_id" => $employee->id,
            "status" => $this->faker->randomElement([
                ReservationStatusEnum::BOOKED,
                ReservationStatusEnum::PENDING,
                ReservationStatusEnum::CHECKED_IN,
            ]),
            "booking_type" => $this->faker->randomElement(BookingTypeEnum::getValues()),
            "visit_purpose" => $this->faker->randomElement(VisitPurposeEnum::getValues()),
            "room_package" => $this->faker->randomElement(RoomPackageEnum::getValues()),
            "payment_method" => $this->faker->randomElement(PaymentEnum::getValues()),
            "status_acc" => StatusAccEnum::APPROVED,
            "discount" => 0,
            "discount_reason" => null,
            "commission_percentage" => 0,
            "commission_amount" => 0,
            "remarks" => $this->faker->sentence,
            "advance_remarks" => $this->faker->sentence,
            "advance_amount" => 100000,
            "canceled_at" => null,
        ];
    }
}
