<?php

namespace Modules\Orders\tests\Feature;

use Illuminate\Support\Str;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;
use Modules\Courses\Models\Course;
use Modules\Bundles\Models\Bundle;
use Modules\Memberships\Models\MembershipPlan;
use Modules\Orders\Models\Order;
use Modules\Orders\Services\FulfillmentService;

class FulfillmentTest extends TestCase
{
    use RefreshDatabase;

    protected $tenant;
    protected $user;
    protected $fulfillment;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->tenant = Tenant::create([
            'name' => 'Test Tenant',
            'slug' => 'test-tenant',
        ]);

        $this->user = User::create([
            'name' => 'Student ' . Str::random(5),
            'email' => 'student' . Str::random(5) . '@test.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'tenant_id' => $this->tenant->id,
            'membership_tier' => 'free',
            'status' => 'active'
        ]);

        $this->fulfillment = new FulfillmentService();
    }

    public function test_fulfills_course_order()
    {
        $course = Course::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Test Course',
            'price' => 50,
        ]);
        $order = Order::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->user->id,
            'total_amount' => 50,
            'status' => 'pending',
            'payment_status' => 'unpaid'
        ]);

        $order->items()->create([
            'itemable_id' => $course->id,
            'itemable_type' => Course::class,
            'price' => 50
        ]);

        $this->fulfillment->fulfill($order);

        $this->assertDatabaseHas('enrollments', [
            'user_id' => $this->user->id,
            'course_id' => $course->id
        ]);
        $this->assertEquals('completed', $order->fresh()->status);
    }

    public function test_fulfills_bundle_order()
    {
        $bundle = Bundle::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Test Bundle',
            'slug' => 'test-bundle',
            'price' => 100,
        ]);

        $order = Order::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->user->id,
            'total_amount' => 100,
            'status' => 'pending',
            'payment_status' => 'unpaid'
        ]);

        $order->items()->create([
            'itemable_id' => $bundle->id,
            'itemable_type' => Bundle::class,
            'price' => 100
        ]);

        $this->fulfillment->fulfill($order);

        $this->assertDatabaseHas('bundle_purchases', [
            'user_id' => $this->user->id,
            'bundle_id' => $bundle->id,
            'order_id' => $order->id
        ]);
    }

    public function test_fulfills_membership_order()
    {
        $plan = MembershipPlan::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Premium',
            'slug' => 'premium',
            'price' => 19,
        ]);

        $order = Order::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->user->id,
            'total_amount' => 19,
            'status' => 'pending',
            'payment_status' => 'unpaid'
        ]);

        $order->items()->create([
            'itemable_id' => $plan->id,
            'itemable_type' => MembershipPlan::class,
            'price' => 19
        ]);

        $this->fulfillment->fulfill($order);

        $this->assertEquals('premium', $this->user->fresh()->membership_tier);
        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $this->user->id,
            'plan_id' => $plan->id,
            'status' => 'active'
        ]);
    }
}
