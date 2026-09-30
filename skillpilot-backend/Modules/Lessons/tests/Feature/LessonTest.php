<?php

namespace Modules\Lessons\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;
use Modules\Courses\Models\Course;
use Modules\Courses\Models\CourseSection;

class LessonTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_add_lesson_to_section()
    {
        $tenant = Tenant::create(['name' => 'Test Tenant', 'domain' => 'test.com', 'slug' => 'test-tenant']);
        
        // Setup Role
        $instructorRole = \Modules\Roles\Models\Role::firstOrCreate(['slug' => 'instructor'], ['name' => 'Instructor']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $user->roles()->attach($instructorRole->id);
        
        $course = Course::create([
            'tenant_id' => $tenant->id,
            'title' => 'Test Course',
            'description' => 'Desc',
            'price' => 0,
        ]);

        $section = CourseSection::create([
            'course_id' => $course->id,
            'title' => 'Section 1',
            'sort_order' => 1,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/lessons', [
            'section_id' => $section->id,
            'title' => 'Lesson 1',
            'content_type' => 'video',
            'content_path' => 'video.mp4',
            'duration' => 600,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('course_lessons', ['title' => 'Lesson 1', 'section_id' => $section->id, 'is_active' => true]);
    }

    public function test_can_soft_delete_lesson()
    {
        $tenant = Tenant::create(['name' => 'T2', 'domain' => 't2.com', 'slug' => 't2']);
        $instructorRole = \Modules\Roles\Models\Role::firstOrCreate(['slug' => 'instructor'], ['name' => 'Instructor']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $user->roles()->attach($instructorRole->id);

        $course = Course::create(['tenant_id' => $tenant->id, 'title' => 'C']);
        $section = $course->sections()->create(['title' => 'S', 'sort_order' => 1]);
        $lesson = $section->lessons()->create(['title' => 'L', 'content_type' => 'text', 'sort_order' => 1]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/lessons/{$lesson->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('course_lessons', ['id' => $lesson->id]);
    }

    public function test_can_toggle_lesson_status()
    {
        $tenant = Tenant::create(['name' => 'T3', 'domain' => 't3.com', 'slug' => 't3']);
        $instructorRole = \Modules\Roles\Models\Role::firstOrCreate(['slug' => 'instructor'], ['name' => 'Instructor']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $user->roles()->attach($instructorRole->id);

        $course = Course::create(['tenant_id' => $tenant->id, 'title' => 'C']);
        $section = $course->sections()->create(['title' => 'S', 'sort_order' => 1]);
        $lesson = $section->lessons()->create(['title' => 'L', 'content_type' => 'text', 'sort_order' => 1, 'is_active' => true]);

        $response = $this->actingAs($user, 'sanctum')->patchJson("/api/lessons/{$lesson->id}/toggle-status");

        $response->assertStatus(200);
        $this->assertEquals(0, $lesson->refresh()->is_active);
    }
}
