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
        Schema::create('juntas_riego', function (Blueprint $table) {
            $table->id('cod_junta_riego');
            $table->integer('num_carpeta_junta_riego')->unique();
            $table->string('junta_riego', 255);
            $table->boolean('is_legalizada');
            $table->date('fecha_solicitud')->nullable();
            $table->date('fecha_resolucion');
            $table->string('num_resolucion', 255);
            $table->integer('cantidad_beneficiarios');
            $table->boolean('is_active')->default(true);
            $table->foreignId('cod_tipo_riego')->constrained('tipo_riego', 'cod_tipo_riego')->onDelete('cascade');
            $table->foreignId('cod_oficina_tecnica')->constrained('oficinas_tecnicas', 'cod_oficina_tecnica')->onDelete('cascade');
            $table->foreignId('cod_parroquia')->constrained('parroquias', 'parroquia_id')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('juntas_riego');
    }
};
