<?php

use App\Enums\RoomConditionEnum;
use App\Enums\RoomStatusEnum;
use App\Enums\SmokingTypeEnum;
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
        Schema::create('bed_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('rate_types', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string("code")->unique();
            $table->string("name")->unique();
            $table->float("rate", 8, 2);
            $table->timestamps();
        });

        Schema::create('room_types', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string("code")->unique();
            $table->string('name')->unique();
            $table->integer('capacity');
            $table->float("size", 4, 2);
            $table->float('base_rate', 8, 2)->nullable();
            $table->json("images")->nullable();
            $table->foreignUuid("rate_type_id")
                ->nullable()
                ->constrained("rate_types")
                ->nullOnDelete();
            $table->foreignUuid("bed_type_id")
                ->nullable()
                ->constrained("bed_types")
                ->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('room_number')->unique();
            $table->integer('floor_number');
            $table->string("view")->nullable();
            $table->enum('condition', RoomConditionEnum::getValues())
                ->default('ready');
            $table->enum('status', RoomStatusEnum::getValues())
                ->default('Vacant');
            $table->float("price", 8, 2);
            $table->integer("capacity");
            $table->float("size", 4, 2);
            $table->enum("smoking_type", SmokingTypeEnum::getValues());
            $table->string("room_layout")->nullable();
            $table->json("images")->nullable();
            $table->foreignUuid("rate_type_id")
                ->nullable()
                ->constrained("rate_types")
                ->nullOnDelete();
            $table->foreignUuid('room_type_id')
                ->constrained("room_types")
                ->onDelete("cascade");
            $table->foreignUuid('bed_type_id')
                ->constrained("bed_types")
                ->onDelete("cascade");
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
            $table->foreignUuid('room_type_id')
                ->constrained("room_types")
                ->onDelete("cascade");
            $table->foreignUuid('facility_id')
                ->constrained("facilities")
                ->onDelete("cascade");
            $table->timestamps();
        });

        Schema::create("room_facilities", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid('room_id')
                ->constrained("rooms")
                ->onDelete("cascade");
            $table->foreignUuid('facility_id')
                ->constrained("facilities")
                ->onDelete("cascade");
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
        Schema::dropIfExists('rate_types');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('facilities');
        Schema::dropIfExists('room_type_facilities');
        Schema::dropIfExists('room_facilities');
    }
};
