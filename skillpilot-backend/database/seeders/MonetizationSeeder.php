<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Memberships\Models\MembershipPlan;
use Modules\Bundles\Models\Bundle;
use Modules\Courses\Models\Course;

class MonetizationSeeder extends Seeder
{
    public function run(): void
    {
        $tenantId = 1; // Default tenant

        // 1. Seed Membership Plans
        $plans = [
            [
                'tenant_id' => $tenantId,
                'name' => 'Bronze Tier',
                'description' => 'Unlimited access to all foundational courses.',
                'price' => 19.99,
                'level' => 1,
                'billing_interval' => 'month',
            ],
            [
                'tenant_id' => $tenantId,
                'name' => 'Silver Tier',
                'description' => 'Access to intermediate courses and priority support.',
                'price' => 49.99,
                'level' => 2,
                'billing_interval' => 'month',
            ],
            [
                'tenant_id' => $tenantId,
                'name' => 'Gold Pass',
                'description' => 'Full access to everything including masterclasses and certificates.',
                'price' => 99.99,
                'level' => 3,
                'billing_interval' => 'month',
            ],
        ];

        foreach ($plans as $plan) {
            MembershipPlan::updateOrCreate(['name' => $plan['name'], 'tenant_id' => $tenantId], $plan);
        }

        // 2. Seed Bundles
        $courses = Course::take(3)->get();
        if ($courses->count() >= 2) {
            $bundle = Bundle::updateOrCreate(
                ['title' => 'Development Quickstart', 'tenant_id' => $tenantId],
                [
                    'description' => 'Get started with our most popular dev courses at a discount.',
                    'price' => 29.99,
                    'is_active' => true,
                ]
            );

            $bundle->courses()->sync($courses->pluck('id'));
        }

        // 3. Update some courses with required levels
        if ($courses->count() > 0) {
            $courses[0]->update(['required_level' => 1]); // Foundational
            if (isset($courses[1])) $courses[1]->update(['required_level' => 2]); // Premium
        }
    }
}
