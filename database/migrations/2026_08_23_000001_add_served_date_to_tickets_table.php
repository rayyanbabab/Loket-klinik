<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Tambah kolom served_date (nullable dulu)
        Schema::table('tickets', function (Blueprint $table) {
            $table->date('served_date')->nullable()->after('service_id');
        });

        // Step 2: Isi served_date dari created_at untuk data yang sudah ada
        DB::statement("UPDATE tickets SET served_date = DATE(created_at) WHERE served_date IS NULL");

        // Step 3: Hapus unique constraint lama (service_id + number_int)
        // dan ganti dengan (service_id + number_int + served_date)
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropUnique(['service_id', 'number_int']);
            $table->unique(
                ['service_id', 'number_int', 'served_date'],
                'tickets_service_date_number_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropUnique('tickets_service_date_number_unique');
            $table->dropColumn('served_date');
            $table->unique(['service_id', 'number_int']);
        });
    }
};
