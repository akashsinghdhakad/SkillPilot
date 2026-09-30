<?php

namespace Modules\Orders\Services;

use Modules\Orders\Models\Order;
use Modules\Bundles\Models\BundlePurchase;
use Modules\Memberships\Models\Subscription;
use Modules\Enrollments\Models\Enrollment;
use Illuminate\Support\Facades\DB;

class FulfillmentService
{
    /**
     * Fulfill an order by granting access to all purchase items.
     */
    public function fulfill(Order $order)
    {
        return DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $this->fulfillItem($order, $item);
            }

            $order->update(['status' => 'completed']);
            
            return true;
        });
    }

    /**
     * Fulfill a specific order item based on its type.
     */
    private function fulfillItem($order, $item)
    {
        $itemable = $item->itemable;
        $user = $order->user;

        switch ($item->itemable_type) {
            case \Modules\Courses\Models\Course::class:
                $this->fulfillCourse($user, $itemable);
                break;

            case \Modules\Bundles\Models\Bundle::class:
                $this->fulfillBundle($order, $user, $itemable);
                break;

            case \Modules\Memberships\Models\MembershipPlan::class:
                $this->fulfillMembership($order, $user, $itemable);
                break;
        }
    }

    private function fulfillCourse($user, $course)
    {
        // Check if already enrolled
        $exists = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if (!$exists) {
            Enrollment::create([
                'tenant_id' => $user->tenant_id,
                'user_id'   => $user->id,
                'course_id' => $course->id,
                'status'    => 'active',
                'enrolled_at' => now(),
            ]);
        }
    }

    private function fulfillBundle($order, $user, $bundle)
    {
        BundlePurchase::updateOrCreate(
            [
                'user_id' => $user->id,
                'bundle_id' => $bundle->id,
            ],
            [
                'tenant_id' => $user->tenant_id,
                'order_id'  => $order->id,
                'purchased_at' => now(),
            ]
        );
    }

    private function fulfillMembership($order, $user, $plan)
    {
        // Update user membership tier
        $user->update(['membership_tier' => $plan->slug]);

        // Create or update subscription record
        Subscription::updateOrCreate(
            ['user_id' => $user->id],
            [
                'tenant_id' => $user->tenant_id,
                'plan_id'   => $plan->id,
                'status'    => 'active',
                'starts_at' => now(),
                'ends_at'   => now()->addMonths(1), // Default 1 month
            ]
        );
    }
}
