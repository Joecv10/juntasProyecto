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
        Schema::table('juntas_riego', function (Blueprint $table) {
            $table->integer('provincia_id');
            $table->integer('canton_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('juntas_riego', function (Blueprint $table) {
            $table->dropColumn('provincia_id');
            $table->dropColumn('canton_id');
        });
    }
};
