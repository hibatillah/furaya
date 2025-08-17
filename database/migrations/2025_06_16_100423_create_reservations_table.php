<?php

use App\Enums\BookingTypeEnum;
use App\Enums\PaymentEnum;
use App\Enums\ReservationStatusEnum;
use App\Enums\ReservationTransactionEnum;
use App\Enums\RoomPackageEnum;
use App\Enums\SmokingTypeEnum;
use App\Enums\StatusAccEnum;
use App\Enums\VisitPurposeEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public $withinTransaction = false;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->date("start_date");
            $table->date("end_date");
            $table->string("booking_number")->unique();
            $table->string("arrival_from")->nullable();
            $table->integer("children")->nullable();
            $table->integer("adults");
            $table->integer("pax");
            $table->integer("length_of_stay");
            $table->float("total_price", 10, 3);
            $table->string("guest_type")->nullable();
            $table->enum("smoking_type", SmokingTypeEnum::getValues())
                ->default(SmokingTypeEnum::NON_SMOKING);
            $table->boolean("include_breakfast")->default(false);
            $table->string("employee_name")->nullable();
            $table->foreignUuid("employee_id")
                ->nullable()
                ->constrained("employees")
                ->nullOnDelete();
            $table->enum("status", ReservationStatusEnum::getValues())
                ->default(ReservationStatusEnum::BOOKED);
            $table->enum("booking_type", BookingTypeEnum::getValues())
                ->default(BookingTypeEnum::OTHER);
            $table->enum("visit_purpose", VisitPurposeEnum::getValues())
                ->default(VisitPurposeEnum::OTHER);
            $table->enum("room_package", RoomPackageEnum::getValues())
                ->default(RoomPackageEnum::OTHER);
            $table->enum("payment_method", PaymentEnum::getValues())
                ->default(PaymentEnum::OTHER);
            $table->enum("status_acc", StatusAccEnum::getValues())
                ->default(StatusAccEnum::PENDING);
            $table->float("discount", 2, 2)->nullable();
            $table->string("discount_reason")->nullable();
            $table->float("commission_percentage", 2, 2)->nullable();
            $table->float("commission_amount", 8, 2)->nullable();
            $table->string("remarks")->nullable();
            $table->string("advance_remarks")->nullable();
            $table->string("advance_amount")->nullable();
            $table->string("snap_token")->nullable();
            $table->string("payment_type")->nullable();
            $table->string("transaction_id")->nullable();
            $table->string("transaction_status")->default("unpaid");
            $table->string("transaction_time")->nullable();
            $table->string("transaction_bank")->nullable();
            $table->timestamp("canceled_at")->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create("reservation_guests", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("reservation_id")
                ->constrained("reservations")
                ->cascadeOnDelete();
            $table->foreignUuid("guest_id")
                ->nullable()
                ->constrained("guests")
                ->nullOnDelete();
            $table->string("name");
            $table->string("phone");
            $table->string("nik_passport")->nullable();
            $table->string("email")->nullable();
            $table->string("address")->nullable();
            $table->string("nationality")->nullable();
            $table->string("nationality_code")->nullable();
            $table->string("country")->nullable();
            $table->string("country_code")->nullable();
            $table->timestamps();
        });

        Schema::create("reservation_rooms", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("reservation_id")
                ->constrained("reservations")
                ->cascadeOnDelete();
            $table->foreignUuid("room_id")
                ->nullable()
                ->constrained("rooms")
                ->nullOnDelete();
            $table->foreignUuid("room_type_id")
                ->nullable()
                ->constrained("room_types")
                ->nullOnDelete();
            $table->string("room_type_name");
            $table->string("room_number")->nullable();
            $table->string("room_rate")->nullable();
            $table->string("bed_type")->nullable();
            $table->string("view")->nullable();
            $table->timestamps();
        });

        Schema::create("reservation_transactions", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("reservation_id")
                ->constrained("reservations")
                ->cascadeOnDelete();
            $table->float("amount", 10, 3);
            $table->enum("type", ReservationTransactionEnum::getValues());
            $table->boolean("is_paid")->default(false);
            $table->string("description");
            $table->timestamps();
        });

        Schema::create('check_ins', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('reservation_id')
                ->constrained('reservations')
                ->cascadeOnDelete();
            $table->foreignUuid('employee_id')
                ->nullable()
                ->constrained('employees')
                ->nullOnDelete();
            $table->datetime('check_in_at');
            $table->string('check_in_by');
            $table->string('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('check_outs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('reservation_id')
                ->constrained('reservations')
                ->cascadeOnDelete();
            $table->foreignUuid('employee_id')
                ->nullable()
                ->constrained('employees')
                ->nullOnDelete();
            $table->datetime('check_out_at');
            $table->string('check_out_by');
            $table->float('additional_charge', 10, 2)->nullable();
            $table->string('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('check_ins');
        Schema::dropIfExists('check_outs');
        Schema::dropIfExists('reservation_guests');
        Schema::dropIfExists('reservation_rooms');
        Schema::dropIfExists('reservation_transactions');
    }
};
