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
        Schema::create('presidente_junta_riego', function (Blueprint $table) {
            $table->id('cod_presidente_junta_riego');
            $table->string('cedula_presidente_junta_riego', 10);
            $table->string('nombres_presidente_junta_riego', 255);
            $table->string('tel_contacto_presidente_junta_riego', 10);
            $table->string('email_presidente_junta_riego', 255);
            $table->date('fecha_caducidad')->nullable();
            $table->boolean('is_active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presidente_junta_riego');
    }
};
