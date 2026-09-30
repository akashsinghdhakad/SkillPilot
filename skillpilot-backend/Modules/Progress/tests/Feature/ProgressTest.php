<?php

namespace Modules\Progress\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;
use Modules\Courses\Models\Course;
use Modules\Lessons\Models\CourseLesson;
use Modules\Courses\Models\CourseSection;

class ProgressTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_mark_lesson_as_completed()
    {
        $tenant = Tenant::create(['name' => 'Test Tenant', 'domain' => 'test.com', 'slug' => 'test-tenant']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        
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

        $lesson = CourseLesson::create([
            'section_id' => $section->id,
            'title' => 'Lesson 1',
            'content_type' => 'text',
            'sort_order' => 1,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/progress/complete', [
            'course_id' => $course->id,
            'lesson_id' => $lesson->id,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('course_progress', [
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
        ]);
    }

    public function test_can_get_course_progress_percentage()
    {
        $tenant = Tenant::create(['name' => 'Test Tenant', 'domain' => 'test.com', 'slug' => 'test-tenant']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        
        $course = Course::create([
            'tenant_id' => $tenant->id,
            'title' => 'Test Course',
            'description' => 'Desc',
            'price' => 0,
        ]);

        $section = CourseSection::create(['course_id' => $course->id, 'title' => 'S1', 'sort_order' => 1]);
        $lesson1 = CourseLesson::create(['section_id' => $section->id, 'title' => 'L1', 'content_type' => 'text', 'sort_order' => 1]);
        $lesson2 = CourseLesson::create(['section_id' => $section->id, 'title' => 'L2', 'content_type' => 'text', 'sort_order' => 2]);

        // Complete 1 of 2 lessons
        $this->actingAs($user, 'sanctum')->postJson('/api/progress/complete', [
            'course_id' => $course->id,
            'lesson_id' => $lesson1->id,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/progress/{$course->id}");

        $response->assertStatus(200)
                 ->assertJson(['percentage' => 50]);
    }
}
