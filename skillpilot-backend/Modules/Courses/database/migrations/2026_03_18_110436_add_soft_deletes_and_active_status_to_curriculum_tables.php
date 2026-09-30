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
        Schema::table('courses', function (Blueprint $table) {
            $table->softDeletes();
            $table->boolean('is_active')->default(true)->after('status');
        });

        Schema::table('course_sections', function (Blueprint $table) {
            $table->softDeletes();
            $table->boolean('is_active')->default(true)->after('title');
        });

        Schema::table('course_lessons', function (Blueprint $table) {
            $table->softDeletes();
            $table->boolean('is_active')->default(true)->after('duration');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_lessons', function (Blueprint $table) {
            if (Schema::hasColumn('course_lessons', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
            if (Schema::hasColumn('course_lessons', 'is_active')) {
                $table->dropColumn('is_active');
            }
        });

        Schema::table('course_sections', function (Blueprint $table) {
            if (Schema::hasColumn('course_sections', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
            if (Schema::hasColumn('course_sections', 'is_active')) {
                $table->dropColumn('is_active');
            }
        });

        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
            if (Schema::hasColumn('courses', 'is_active')) {
                $table->dropColumn('is_active');
            }
        });
    }
};
