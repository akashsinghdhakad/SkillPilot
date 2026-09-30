<?php

namespace Modules\Payments\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;
use Modules\Orders\Models\Order;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_process_payment()
    {
        $tenant = Tenant::create(['name' => 'Test Tenant', 'domain' => 'test.com', 'slug' => 'test-tenant']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $order = Order::create([
            'tenant_id' => $tenant->id,
            'user_id' => $user->id,
            'total_amount' => 50,
            'status' => 'pending',
            'payment_status' => 'unpaid'
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/payments/process', [
            'order_id' => $order->id,
            'payment_method' => 'stripe',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'payment_status' => 'paid']);
        $this->assertDatabaseHas('payments', ['order_id' => $order->id, 'status' => 'successful']);
    }
}
