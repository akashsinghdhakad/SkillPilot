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
        Schema::table('order_items', function (Blueprint $table) {
            $table->renameColumn('course_id', 'itemable_id');
            $table->string('itemable_type')->after('id')->default('Modules\\Courses\\Models\\Course');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->renameColumn('itemable_id', 'course_id');
            $table->dropColumn('itemable_type');
        });
    }
};
