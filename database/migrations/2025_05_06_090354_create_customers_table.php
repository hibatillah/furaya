<?php

use App\Enums\GenderEnum;
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
        Schema::create('customers', function (Blueprint $table) {
            $table->uuid()->primary();
            $table->foreignId('user_id')->constrained("users")->onDelete('cascade');
            $table->string('nik_passport')->unique();
            $table->date('birthdate')->nullable();
            $table->enum('gender', GenderEnum::getValues())->nullable();
            $table->string('phone')->unique()->nullable();
            $table->string("profession")->nullable();
            $table->string("nationality")->nullable();
            $table->string("province")->nullable();
            $table->string("city")->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
