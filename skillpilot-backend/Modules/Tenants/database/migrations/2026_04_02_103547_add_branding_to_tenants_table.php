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
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('certificate_logo_path')->nullable();
            $table->string('certificate_signature_path')->nullable();
            $table->string('brand_color')->default('#0284c7'); // Default SkillPilot Blue
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn(['certificate_logo_path', 'certificate_signature_path', 'brand_color']);
        });
    }
};
