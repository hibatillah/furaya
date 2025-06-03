<?php

use App\Enums\RoomConditionEnum;
use App\Enums\RoomStatusEnum;
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
        Schema::create('room_types', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string('name')->unique();
            $table->integer('capacity');
            $table->float('base_rate', 8, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('bed_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create("room_status", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("employee_id")->constrained("employees")->nullOnDelete();
            $table->enum('status', RoomStatusEnum::getValues());
            $table->datetime("from");
            $table->datetime("to");
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('room_number')->unique();
            $table->integer('floor_number');
            $table->string("view")->nullable();
            $table->enum('condition', RoomConditionEnum::getValues())->default('ready');
            $table->float("price", 8, 2);
            $table->integer("capacity");
            $table->foreignUuid('room_type_id')->constrained("room_types")->onDelete("cascade");
            $table->foreignUuid('bed_type_id')->constrained("bed_types")->onDelete("cascade");
            $table->foreignUuid('room_status_id')->nullable()->constrained("room_status")->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create("facilities", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string("name")->unique();
            $table->string("description")->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create("room_type_facilities", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("room_type_id")->constrained("room_types")->onDelete("cascade");
            $table->foreignUuid("facility_id")->constrained("facilities")->onDelete("cascade");
            $table->timestamps();
        });

        Schema::create("room_facilities", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("room_id")->constrained("rooms")->onDelete("cascade");
            $table->foreignUuid("facility_id")->constrained("facilities")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_types');
        Schema::dropIfExists('bed_types');
        Schema::dropIfExists('room_status');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('facilities');
        Schema::dropIfExists('room_facilities');
    }
};
