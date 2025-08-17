<?php

use App\Enums\GenderEnum;
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
        Schema::create('departments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('employees', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained("users")
                ->nullOnDelete();
            $table->foreignUuid('department_id')
                ->constrained("departments")
                ->onDelete('cascade');
            $table->enum('gender', GenderEnum::getValues());
            $table->string('phone')->unique()->nullable();
            $table->string('address')->nullable();
            $table->date('hire_date');
            $table->float('salary', 8, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('guests', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained("users")
                ->nullOnDelete();
            $table->string('nik_passport')->unique()->nullable();
            $table->string('phone')->unique();
            $table->date('birthdate')->nullable();
            $table->enum('gender', GenderEnum::getValues())->nullable();
            $table->string("profession")->nullable();
            $table->string("nationality")->nullable();
            $table->string("nationality_code")->nullable();
            $table->string("country")->nullable();
            $table->string("country_code")->nullable();
            $table->string("address")->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('departments');
    }
};
