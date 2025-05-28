<?php

use App\Enums\BookingTypeEnum;
use App\Enums\PaymentEnum;
use App\Enums\RoomPackageEnum;
use App\Enums\VisitPurposeEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->integer("booking_number")->unique();
            $table->integer("adults");
            $table->integer("people_count");
            $table->integer("length_of_stay");
            $table->datetime("check_in");
            $table->datetime("check_out");
            $table->float("total_price", 10, 3);
            $table->foreignUuid("room_id")->constrained("rooms")->nullOnDelete();
            $table->foreignUuid("customer_id")->constrained("customers")->nullOnDelete();
            $table->foreignUuid("employee_id")->constrained("employees")->nullOnDelete();
            $table->enum("booking_type", BookingTypeEnum::getValues())->default(BookingTypeEnum::OTHER);
            $table->enum("purpose", VisitPurposeEnum::getValues())->default(VisitPurposeEnum::OTHER);
            $table->enum("room_package", RoomPackageEnum::getValues())->default(RoomPackageEnum::OTHER);
            $table->enum("payment_method", PaymentEnum::getValues())->default(PaymentEnum::OTHER);
            $table->string("arrival_from")->nullable();
            $table->string("booked_from")->nullable();
            $table->integer("children")->nullable();
            $table->integer("extra_bed")->nullable();
            $table->float("discount", 2, 2)->nullable();
            $table->string("discount_reason")->nullable();
            $table->float("commission_percentage", 2, 2)->nullable();
            $table->float("commission_amount", 8, 2)->nullable();
            $table->string("remarks")->nullable();
            $table->string("advance_remarks")->nullable();
            $table->string("advance_amount")->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('check_ins', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('reservation_id')->constrained('reservations')->cascadeOnDelete();
            $table->datetime('checked_in_at');
            $table->foreignUuid('employee_id')->constrained('employees')->nullOnDelete();
            $table->string('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('check_outs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('reservation_id')->constrained('reservations')->cascadeOnDelete();
            $table->datetime('checked_out_at');
            $table->foreignUuid('employee_id')->constrained('employees')->nullOnDelete();
            $table->float('final_total', 10, 2);
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
    }
};
