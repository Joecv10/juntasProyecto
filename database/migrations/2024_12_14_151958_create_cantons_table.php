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
        Schema::create('cantones', function (Blueprint $table) {
            $table->id('canton_id');
            $table->foreignId('provincia_id')->constrained('provincias', 'provincia_id')->onDelete('cascade');
            $table->string('cod_canton'); // cod_canton
            $table->string('canton');    // canton
            // $table->timestamps();


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cantones');
    }
};
