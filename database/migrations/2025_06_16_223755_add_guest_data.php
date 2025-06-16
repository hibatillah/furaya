<?php

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
        Schema::create('guest_types', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string("code")->unique();
            $table->string("name")->unique();
            $table->foreignId("created_by")
                ->nullable()
                ->constrained("users")
                ->nullOnDelete();
            $table->timestamps();
        });


        Schema::create("nationalities", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string("code")->unique();
            $table->string("name")->unique();
            $table->foreignId("created_by")
                ->nullable()
                ->constrained("users")
                ->nullOnDelete();
            $table->timestamps();
        });

        Schema::create("geographies", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string("code")->unique();
            $table->string("name")->unique();
            $table->foreignId("created_by")
                ->nullable()
                ->constrained("users")
                ->nullOnDelete();
            $table->timestamps();
        });

        Schema::create("countries", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string("code")->unique();
            $table->string("name")->unique();
            $table->foreignId("created_by")
                ->nullable()
                ->constrained("users")
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guest_types');
        Schema::dropIfExists('rate_types');
        Schema::dropIfExists('nationalities');
        Schema::dropIfExists('geographies');
        Schema::dropIfExists('countries');
    }
};
