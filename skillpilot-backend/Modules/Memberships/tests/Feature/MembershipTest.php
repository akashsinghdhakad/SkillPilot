<?php

namespace Modules\Memberships\Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Modules\Tenants\Models\Tenant;
use Modules\Memberships\Models\MembershipPlan;
use Modules\Memberships\Models\Subscription;
use Modules\Courses\Models\Course;
use Modules\Courses\Services\CourseAccessService;

class MembershipTest extends TestCase
{
    use RefreshDatabase;

    protected $tenant;
    protected $student;
    protected $accessService;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->tenant = Tenant::create(['name' => 'Test Membership Tenant', 'slug' => 'test-membership']);
        
        $studentRole = \Modules\Roles\Models\Role::create(['name' => 'Student', 'slug' => 'student']);

        $this->student = User::factory()->create([
            'tenant_id' => $this->tenant->id,
        ]);
        $this->student->roles()->attach($studentRole->id);

        $this->accessService = app(CourseAccessService::class);
    }

    public function test_can_access_course_with_matching_membership_level()
    {
        // 1. Create a Level 2 Plan
        $plan = MembershipPlan::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Silver',
            'price' => 50,
            'level' => 2,
            'is_active' => true
        ]);

        // 2. Subscribe student
        Subscription::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->student->id,
            'plan_id' => $plan->id,
            'starts_at' => now(),
            'status' => 'active'
        ]);

        // 3. Level 2 Course -> Access Granted
        $course2 = Course::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Advanced Course',
            'required_level' => 2,
            'price' => 100
        ]);

        $this->assertTrue($this->accessService->canAccess($this->student, $course2));

        // 4. Level 1 Course -> Access Granted
        $course1 = Course::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Basic Course',
            'required_level' => 1,
            'price' => 100
        ]);

        $this->assertTrue($this->accessService->canAccess($this->student, $course1));
    }

    public function test_cannot_access_course_with_lower_membership_level()
    {
        // 1. Create a Level 1 Plan
        $plan = MembershipPlan::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Bronze',
            'price' => 20,
            'level' => 1,
            'is_active' => true
        ]);

        Subscription::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->student->id,
            'plan_id' => $plan->id,
            'starts_at' => now(),
            'status' => 'active'
        ]);

        // 2. Level 2 Course -> Access Denied
        $course2 = Course::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Advanced Course',
            'required_level' => 2,
            'price' => 100
        ]);

        $this->assertFalse($this->accessService->canAccess($this->student, $course2));
    }

    public function test_student_can_see_subscription_status()
    {
        $plan = MembershipPlan::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Bronze',
            'price' => 20,
            'level' => 1,
            'is_active' => true
        ]);

        Subscription::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->student->id,
            'plan_id' => $plan->id,
            'starts_at' => now(),
            'status' => 'active'
        ]);

        $response = $this->actingAs($this->student, 'sanctum')
            ->getJson('/api/v1/memberships/status');

        $response->assertStatus(200)
            ->assertJsonPath('plan.name', 'Bronze');
    }
}
