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
        Schema::create('direccion_zonal', function (Blueprint $table) {
            $table->id('cod_direccion_zonal');
            $table->string('direccion_zonal', 100);
            $table->foreignId('cod_oficina_tecnica')->constrained('oficinas_tecnicas', 'cod_oficina_tecnica')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('direccion_zonal');
    }
};
