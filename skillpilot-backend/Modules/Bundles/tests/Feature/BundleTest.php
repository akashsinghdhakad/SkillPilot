<?php

namespace Modules\Bundles\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;
use Modules\Bundles\Models\Bundle;
use Modules\Bundles\Models\BundlePurchase;
use Modules\Courses\Models\Course;
use Modules\Enrollments\Models\Enrollment;

class BundleTest extends TestCase
{
    use RefreshDatabase;

    protected $tenant;
    protected $student;
    protected $course;
    protected $bundle;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->tenant = Tenant::create(['name' => 'Test Bundle Tenant', 'slug' => 'test-bundle']);
        
        $studentRole = \Modules\Roles\Models\Role::create(['name' => 'Student', 'slug' => 'student']);

        $this->student = User::factory()->create([
            'tenant_id' => $this->tenant->id,
        ]);
        $this->student->roles()->attach($studentRole->id);

        $this->course = Course::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Bundle Course',
            'description' => 'Test',
            'price' => 50
        ]);

        $this->bundle = Bundle::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Super Bundle',
            'price' => 100,
            'is_active' => true
        ]);

        // Link course to bundle
        $this->bundle->courses()->attach($this->course->id);
    }

    public function test_student_can_see_owned_bundles()
    {
        BundlePurchase::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->student->id,
            'bundle_id' => $this->bundle->id,
            'purchased_at' => now()
        ]);

        $response = $this->actingAs($this->student, 'sanctum')
            ->getJson('/api/v1/bundles/owned');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_student_can_unlock_course_from_bundle()
    {
        // 1. Purchase bundle
        BundlePurchase::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->student->id,
            'bundle_id' => $this->bundle->id,
            'purchased_at' => now()
        ]);

        // 2. Unlock course
        $response = $this->actingAs($this->student, 'sanctum')
            ->postJson('/api/enrollments/unlock', [
                'course_id' => $this->course->id
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('message', 'Course unlocked successfully!');

        // 3. Verify enrollment
        $this->assertTrue(Enrollment::where('user_id', $this->student->id)
            ->where('course_id', $this->course->id)
            ->exists());
    }

    public function test_student_cannot_unlock_unowned_course()
    {
        // No bundle purchase
        
        $response = $this->actingAs($this->student, 'sanctum')
            ->postJson('/api/enrollments/unlock', [
                'course_id' => $this->course->id
            ]);

        $response->assertStatus(403)
            ->assertJsonPath('message', 'You do not have a bundle that includes this course.');
    }
}
