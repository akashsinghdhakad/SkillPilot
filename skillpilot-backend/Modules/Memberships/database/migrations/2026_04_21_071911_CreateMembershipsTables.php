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
        // 1. Membership Plans
        Schema::create('membership_plans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->string('name'); // Bronze, Silver, Gold
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('level')->default(1); // 1 = Basic, 2 = Premium, etc.
            $table->string('billing_interval')->default('month'); // month, year
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. User Subscriptions
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->index();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('membership_plans')->onDelete('cascade');
            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();
            $table->string('status')->default('active'); // active, cancelled, expired
            $table->timestamps();
        });

        // 3. Add level to courses to gate access
        if (!Schema::hasColumn('courses', 'required_level')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->integer('required_level')->default(0)->after('price'); 
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('membership_plans');
        
        if (Schema::hasColumn('courses', 'required_level')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->dropColumn('required_level');
            });
        }
    }
};
