<?php

namespace Modules\Courses\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;
use Modules\Courses\Models\Course;

class CourseTest extends TestCase
{
    use RefreshDatabase;

    protected $tenant;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tenant = Tenant::create(['name' => 'Test Tenant', 'domain' => 'test.com', 'slug' => 'test-tenant']);
        
        // Create roles
        $instructorRole = \Modules\Roles\Models\Role::create([
            'name' => 'Instructor',
            'slug' => 'instructor'
        ]);
        \Modules\Roles\Models\Role::create([
            'name' => 'Admin',
            'slug' => 'admin'
        ]);

        $this->user = User::factory()->create(['tenant_id' => $this->tenant->id]);
        $this->user->roles()->attach($instructorRole->id);
    }

    public function test_instructor_can_create_course()
    {
        $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/courses', [
            'title' => 'New Course',
            'description' => 'Course description',
            'price' => 49.99,
            'status' => 'published',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('courses', ['title' => 'New Course', 'tenant_id' => $this->tenant->id]);
    }

    public function test_can_add_section_to_course()
    {
        $course = Course::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Test Course',
            'description' => 'Desc',
            'price' => 0,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->postJson("/api/courses/{$course->id}/sections", [
            'title' => 'Introduction',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('course_sections', ['title' => 'Introduction', 'course_id' => $course->id, 'is_active' => true]);
    }

    public function test_can_toggle_course_active_status()
    {
        $course = Course::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Active Course',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->putJson("/api/courses/{$course->id}", [
            'is_active' => false,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(0, $course->refresh()->is_active);
    }

    public function test_can_soft_delete_section()
    {
        $course = Course::create(['tenant_id' => $this->tenant->id, 'title' => 'Course']);
        $section = $course->sections()->create(['title' => 'Section', 'sort_order' => 1]);

        $response = $this->actingAs($this->user, 'sanctum')->deleteJson("/api/sections/{$section->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('course_sections', ['id' => $section->id]);
    }

    public function test_can_toggle_section_status()
    {
        $course = Course::create(['tenant_id' => $this->tenant->id, 'title' => 'Course']);
        $section = $course->sections()->create(['title' => 'Section', 'sort_order' => 1, 'is_active' => true]);

        $response = $this->actingAs($this->user, 'sanctum')->patchJson("/api/sections/{$section->id}/toggle-status");

        $response->assertStatus(200);
        $this->assertEquals(0, $section->refresh()->is_active);
    }
}
