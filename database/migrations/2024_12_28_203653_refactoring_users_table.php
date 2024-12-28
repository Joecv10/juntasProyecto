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
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('provincia_oficina_tecnica');
            $table->dropColumn('role');
            $table->foreignId('cod_oficina_tecnica')->constrained('oficinas_tecnicas', 'cod_oficina_tecnica')->onDelete('cascade');
            $table->foreignId('cod_role')->constrained('roles', 'cod_role')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('provincia_oficina_tecnica');
            $table->string('role');
            $table->dropForeign(['cod_oficina_tecnica']);
            $table->dropColumn('cod_oficina_tecnica');
            $table->dropForeign(['cod_role']);
            $table->dropColumn('cod_role');
        });
    }
};
