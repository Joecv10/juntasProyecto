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
            $table->dropColumn('name');
            $table->string('names');
            $table->string('last_names');
            $table->string('provincia_oficina_tecnica');
            $table->string('role');
            $table->boolean('is_active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name');
            $table->dropColumn('names');
            $table->dropColumn('last_names');
            $table->dropColumn('provincia_oficina_tecnica');
            $table->dropColumn('role');
            $table->dropColumn('is_active')->default(true);
        });
    }
};
