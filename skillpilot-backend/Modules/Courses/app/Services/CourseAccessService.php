<?php

namespace Modules\Courses\Services;

use App\Models\User;
use Modules\Courses\Models\Course;
use Modules\Enrollments\Models\Enrollment;
use Modules\Memberships\Models\Subscription;
use Modules\Bundles\Models\BundlePurchase;

class CourseAccessService
{
    /**
     * Determine if a user has full access to a specific course.
     */
    public function canAccess(User $user, Course $course): bool
    {
        // 1. Direct Enrollment (Purchased or Unlocked)
        $isEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->exists();

        if ($isEnrolled) return true;

        // 2. Check for Active Tiered Membership
        $activeSubscription = Subscription::where('user_id', $user->id)
            ->active()
            ->with('plan')
            ->first();

        if ($activeSubscription && $activeSubscription->plan->level >= $course->required_level) {
            return true;
        }

        return false;
    }

    /**
     * Determine if a user owns a bundle that contains this course (Eligible to Unlock).
     */
    public function canUnlock(User $user, Course $course): bool
    {
        return BundlePurchase::where('user_id', $user->id)
            ->whereHas('bundle.courses', function($query) use ($course) {
                $query->where('courses.id', $course->id);
            })
            ->exists();
    }
}
