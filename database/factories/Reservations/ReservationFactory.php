<?php

namespace Database\Factories\Reservations;

use App\Enums\BookingTypeEnum;
use App\Enums\PaymentEnum;
use App\Enums\ReservationStatusEnum;
use App\Enums\RoomPackageEnum;
use App\Enums\SmokingTypeEnum;
use App\Enums\StatusAccEnum;
use App\Enums\VisitPurposeEnum;
use App\Models\Managements\Employee;
use App\Models\Reservations\GuestType;
use App\Models\Reservations\Reservation;
use App\Models\Rooms\Room;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservations\Reservation>
 */
class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $now = now()->format('Ymd');
        $chances = $this->faker->numberBetween(1, 100);
        $transactionStatus = "unpaid";

        // reservation details
        $startDate = Carbon::instance(
            $this->faker->dateTimeBetween('-8 month', '+6 month')
        );
        $endDate = $startDate->copy()->addDays(
            $this->faker->numberBetween(1, 3)
        );
        $lengthOfStay = $startDate->diffInDays($endDate);

        if ($endDate->isBefore(now())) {
            $status = match (true) {
                $chances <= 60 => ReservationStatusEnum::CHECKED_OUT,
                $chances <= 80 => ReservationStatusEnum::OVERDUE,
                $chances <= 95 => ReservationStatusEnum::CANCELLED,
                default        => ReservationStatusEnum::NO_SHOW,
            };

            $statusAcc = match (true) {
                $chances <= 95 => StatusAccEnum::APPROVED,
                default        => StatusAccEnum::REJECTED,
            };

            if ($statusAcc === StatusAccEnum::APPROVED) {
                $transactionStatus = "settlement";
            }
        } else if ($startDate->isAfter(now()->endOfDay())) {
            $status = match (true) {
                $chances <= 80 => ReservationStatusEnum::BOOKED,
                default        => ReservationStatusEnum::PENDING,
            };

            switch ($status) {
                case ReservationStatusEnum::PENDING:
                    $statusAcc = StatusAccEnum::PENDING;
                    break;
                case ReservationStatusEnum::BOOKED:
                    $statusAcc = StatusAccEnum::APPROVED;
                    $transactionStatus = "settlement";
                    break;
                default:
                    $statusAcc = StatusAccEnum::REJECTED;
                    break;
            }
        } else {
            $status = ReservationStatusEnum::CHECKED_IN;
            $statusAcc = StatusAccEnum::APPROVED;
        }

        // room and guest details
        $room = Room::all()->random();
        $adults = $this->faker->numberBetween(1, 3);
        $children = $this->faker->numberBetween(0, 2);
        $pax = $adults + $children;

        $employee = Employee::with('user')->get()->random();

        // price details
        $discountPercentage = $this->faker->numberBetween(0, 25);
        $priceBeforeDiscount = $room->price * $lengthOfStay;
        $discount = $priceBeforeDiscount * ($discountPercentage / 100);
        $finalPrice = $priceBeforeDiscount - $discount;

        return [
            "start_date" => $startDate,
            "end_date" => $endDate,
            "booking_number" => $now . $this->faker->unique()->numerify('####'),
            "arrival_from" => strtoupper($this->faker->city),
            "children" => $children,
            "adults" => $adults,
            "pax" => $pax,
            "length_of_stay" => $lengthOfStay,
            "total_price" => $finalPrice,
            "guest_type" => GuestType::all()->random()->name,
            "smoking_type" => $this->faker->randomElement(SmokingTypeEnum::getValues()),
            "include_breakfast" => $this->faker->boolean,
            "employee_name" => $employee->user->name,
            "employee_id" => $employee->id,
            "status" => $status,
            "booking_type" => $this->faker->randomElement(BookingTypeEnum::getValues()),
            "visit_purpose" => $this->faker->randomElement(VisitPurposeEnum::getValues()),
            "room_package" => $this->faker->randomElement(RoomPackageEnum::getValues()),
            "payment_method" => $this->faker->randomElement(PaymentEnum::getValues()),
            "status_acc" => $statusAcc,
            "discount" => $discountPercentage,
            "discount_reason" => null,
            "commission_percentage" => 0,
            "commission_amount" => 0,
            "remarks" => $this->faker->sentence,
            "advance_remarks" => $this->faker->sentence,
            "advance_amount" => $this->faker->numberBetween(100000, 200000),
            "canceled_at" => $status === ReservationStatusEnum::CANCELLED
                ? $startDate->copy()->addDays(
                    $this->faker->numberBetween(-1, -3)
                )
                : null,
            "transaction_status" => $transactionStatus,
        ];
    }
}
