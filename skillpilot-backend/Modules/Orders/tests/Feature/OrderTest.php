<?php

namespace Modules\Orders\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;
use Modules\Courses\Models\Course;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_order()
    {
        $tenant = Tenant::create(['name' => 'Test Tenant', 'domain' => 'test.com', 'slug' => 'test-tenant']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $course = Course::create(['tenant_id' => $tenant->id, 'title' => 'C1', 'description' => 'D1', 'price' => 100]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/orders', [
            'course_ids' => [$course->id],
        ]);

        $response->assertStatus(201)
                 ->assertJson(['total_amount' => 100]);
        
        $this->assertDatabaseHas('orders', ['user_id' => $user->id, 'total_amount' => 100]);
        $this->assertDatabaseHas('order_items', ['course_id' => $course->id]);
    }
}
