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
        Schema::table('oficinas_tecnicas', function (Blueprint $table) {
            $table->foreignId('cod_direccion_zonal')->constrained('direccion_zonal', 'cod_direccion_zonal')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('oficinas_tecnicas', function (Blueprint $table) {
            $table->dropForeign('cod_direccion_zonal');
            $table->dropColumn('cod_direccion_zonal');
        });
    }
};
