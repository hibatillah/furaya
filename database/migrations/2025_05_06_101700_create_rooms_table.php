<?php

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

        Schema::create('rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('room_number')->unique();
            $table->integer('floor_number');
            $table->enum('status', RoomStatusEnum::getValues())->default('ready');
            $table->foreignUuid('room_type_id')->constrained("room_types")->nullOnDelete();
            $table->foreignUuid('bed_type_id')->constrained("bed_types")->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_types');
        Schema::dropIfExists('bed_types');
        Schema::dropIfExists('rooms');
    }
};
