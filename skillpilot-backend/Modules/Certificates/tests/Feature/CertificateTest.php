<?php

namespace Modules\Certificates\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;
use Modules\Courses\Models\Course;
use Modules\Enrollments\Models\LessonProgress;
use Modules\Assessments\Models\Quiz;
use Modules\Assessments\Models\QuizAttempt;

class CertificateTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_issue_certificate_after_completion()
    {
        $tenant = Tenant::create(['name' => 'Test Tenant', 'slug' => 'test-tenant']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $course = Course::create(['tenant_id' => $tenant->id, 'title' => 'Test Course', 'description' => 'Desc', 'price' => 0]);
        
        // Add a section and a lesson
        $section = \Modules\Courses\Models\CourseSection::create(['course_id' => $course->id, 'title' => 'S1', 'sort_order' => 1]);
        $lesson = \Modules\Lessons\Models\CourseLesson::create(['section_id' => $section->id, 'title' => 'L1', 'type' => 'video', 'content' => 'c']);

        // Mark as completed
        LessonProgress::create([
            'tenant_id' => $tenant->id,
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
            'is_completed' => true,
            'completed_at' => now()
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/certificates/issue', [
            'course_id' => $course->id,
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['certificate_no']);
    }

    public function test_cannot_issue_certificate_if_quiz_failed()
    {
        $tenant = Tenant::create(['name' => 'Test Tenant', 'slug' => 'test-tenant']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $course = Course::create(['tenant_id' => $tenant->id, 'title' => 'Test Course', 'description' => 'Desc', 'price' => 0]);
        
        $section = \Modules\Courses\Models\CourseSection::create(['course_id' => $course->id, 'title' => 'S1', 'sort_order' => 1]);
        $lesson = \Modules\Lessons\Models\CourseLesson::create(['section_id' => $section->id, 'title' => 'L1', 'type' => 'video', 'content' => 'c']);

        LessonProgress::create([
            'tenant_id' => $tenant->id,
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
            'is_completed' => true,
            'completed_at' => now()
        ]);

        $quiz = Quiz::create([
            'tenant_id' => $tenant->id, 
            'course_id' => $course->id, 
            'title' => 'Final Quiz', 
            'passing_score' => 80
        ]);

        // Attempt without passing quiz
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/certificates/issue', [
            'course_id' => $course->id,
        ]);

        $response->assertStatus(403)
                 ->assertJsonPath('message', 'The final assessment has not been passed yet.');
    }

    public function test_can_download_certificate()
    {
        $tenant = Tenant::create(['name' => 'Test Tenant', 'slug' => 'test-tenant']);
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $course = Course::create(['tenant_id' => $tenant->id, 'title' => 'Test Course', 'description' => 'Desc', 'price' => 0]);
        
        $certificate = \Modules\Certificates\Models\Certificate::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
        ]);

        $response = $this->actingAs($user, 'sanctum')->get("/api/certificates/{$certificate->id}/download");

        if ($response->status() !== 200) {
            $response->dump();
        }

        $response->assertStatus(200)
                 ->assertHeader('Content-Type', 'application/pdf');
    }
}
