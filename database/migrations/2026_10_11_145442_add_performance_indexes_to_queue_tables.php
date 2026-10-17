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
        Schema::table('tickets', function (Blueprint $table) {
            $table->index(['served_date', 'service_id', 'status', 'number_int'], 'idx_tickets_waiting_order');
            $table->index(['served_date', 'service_id', 'status', 'called_at'], 'idx_tickets_called_service');
            $table->index(['served_date', 'counter_id', 'status', 'called_at'], 'idx_tickets_counter_status');
            $table->index(['served_date', 'status'], 'idx_tickets_served_status');
            $table->index('counter_id', 'idx_tickets_counter_id');
            $table->index('service_id', 'idx_tickets_service_id');
        });

        Schema::table('counters', function (Blueprint $table) {
            $table->index(['is_active', 'service_id'], 'idx_counters_active_service');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->index('is_active', 'idx_services_is_active');
        });

        Schema::table('calls', function (Blueprint $table) {
            $table->index(['ticket_id', 'counter_id'], 'idx_calls_ticket_counter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex('idx_tickets_waiting_order');
            $table->dropIndex('idx_tickets_called_service');
            $table->dropIndex('idx_tickets_counter_status');
            $table->dropIndex('idx_tickets_served_status');
            $table->dropIndex('idx_tickets_counter_id');
            $table->dropIndex('idx_tickets_service_id');
        });

        Schema::table('counters', function (Blueprint $table) {
            $table->dropIndex('idx_counters_active_service');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex('idx_services_is_active');
        });

        Schema::table('calls', function (Blueprint $table) {
            $table->dropIndex('idx_calls_ticket_counter');
        });
    }
};
