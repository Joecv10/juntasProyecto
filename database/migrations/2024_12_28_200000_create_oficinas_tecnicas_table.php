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
        Schema::create('oficinas_tecnicas', function (Blueprint $table) {
            $table->id('cod_oficina_tecnica');
            $table->foreignId('id_provincia')->constrained('provincias', 'provincia_id')->onDelete('cascade');
            $table->string('oficina_tecnica');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('oficinas_tecnicas');
    }
};
