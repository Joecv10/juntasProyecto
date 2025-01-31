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
        Schema::create('parroquias', function (Blueprint $table) {
            $table->id('parroquia_id');
            $table->foreignId('canton_id')->constrained('cantones', 'canton_id')->onDelete('cascade');
            $table->string('cod_parroquia'); // cod_parroquia
            $table->string('parroquia');    // parroquia
            // $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parroquias');
    }
};
