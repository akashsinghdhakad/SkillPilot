<?php

namespace Modules\Admin\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;

class AdminAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    protected $tenant;
    protected $admin;
    protected $student;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->tenant = Tenant::create(['name' => 'Test Analytics Tenant', 'slug' => 'test-analytics']);
        
        // Create roles
        $adminRole = \Modules\Roles\Models\Role::create(['name' => 'Admin', 'slug' => 'admin']);
        $studentRole = \Modules\Roles\Models\Role::create(['name' => 'Student', 'slug' => 'student']);

        $this->admin = User::factory()->create([
            'tenant_id' => $this->tenant->id,
        ]);
        $this->admin->roles()->attach($adminRole->id);

        $this->student = User::factory()->create([
            'tenant_id' => $this->tenant->id,
        ]);
        $this->student->roles()->attach($studentRole->id);
    }

    public function test_admin_can_access_dashboard_stats()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'revenue',
                'active_students',
                'total_enrollments',
                'completion_rate'
            ]);
    }

    public function test_student_cannot_access_dashboard_stats()
    {
        $response = $this->actingAs($this->student, 'sanctum')
            ->getJson('/api/v1/admin/dashboard/stats');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_revenue_chart_data()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/dashboard/revenue');

        $response->assertStatus(200);
    }
}
