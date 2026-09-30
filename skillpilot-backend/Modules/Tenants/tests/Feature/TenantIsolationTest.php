<?php

namespace Modules\Tenants\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;
use Modules\Courses\Models\Course;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_cannot_access_other_tenant_data()
    {
        // Create Tenant A and a course for it
        $tenantA = Tenant::create(['name' => 'Tenant A', 'domain' => 'a.com', 'slug' => 'tenant-a']);
        $courseA = Course::create([
            'tenant_id' => $tenantA->id,
            'title' => 'Course A',
            'description' => 'Desc A',
            'price' => 10,
        ]);

        // Create Tenant B and a user for it
        $tenantB = Tenant::create(['name' => 'Tenant B', 'domain' => 'b.com', 'slug' => 'tenant-b']);
        $userB = User::factory()->create(['tenant_id' => $tenantB->id]);

        // Create roles needed for access
        $instructorRole = \Modules\Roles\Models\Role::create([
            'name' => 'Instructor',
            'slug' => 'instructor'
        ]);
        \Modules\Roles\Models\Role::create([
            'name' => 'Admin',
            'slug' => 'admin'
        ]);

        $userB->roles()->attach($instructorRole->id);

        // Act as User B and try to list courses
        // The global scope should prevent seeing Course A
        $response = $this->actingAs($userB, 'sanctum')->getJson('/api/courses');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json());
        
        // Try to access Course A directly
        $response = $this->actingAs($userB, 'sanctum')->getJson("/api/courses/{$courseA->id}");
        $response->assertStatus(404);
    }
}
