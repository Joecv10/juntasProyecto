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
        Schema::create('historico_presidentes_j_r', function (Blueprint $table) {
            $table->foreignId('cod_junta_riego')->constrained('juntas_riego', 'cod_junta_riego')->onDelete('cascade');
            $table->foreignId('cod_presidente_junta_riego')->constrained('presidente_junta_riego', 'cod_presidente_junta_riego')->onDelete('cascade');
            $table->foreignId('cod_tipo_presidente')->constrained('tipo_presidente', 'cod_tipo_presidente')->onDelete('cascade');
            $table->date('fecha_solicitud_nombramiento')->nullable();
            $table->date('fecha_emision_nombramiento')->nullable();
            $table->string('Observaciones', 255)->nullable();
            $table->boolean('is_active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historico_presidentes_j_r');
    }
};
