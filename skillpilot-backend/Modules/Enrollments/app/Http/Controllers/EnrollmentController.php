<?php

namespace Modules\Enrollments\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Enrollments\Models\Enrollment;
use Modules\Courses\Models\Course;

use Modules\Enrollments\Models\LessonProgress;
use Modules\Bundles\Models\BundlePurchase;
use Modules\Bundles\Models\Bundle;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the authenticated user's enrollments.
     */
    public function index(Request $request)
    {
        $enrollments = Enrollment::where('user_id', $request->user()->id)
            ->with(['course' => function($query) {
                $query->select('id', 'title', 'thumbnail', 'is_active');
            }])
            ->get();

        return response()->json($enrollments);
    }

    /**
     * Enroll the authenticated user in a course (Quick Enroll / Free).
     */
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
        ]);

        $user = $request->user();
        $courseId = $request->course_id;

        // Check if already enrolled
        $existing = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already enrolled in this course.'], 200);
        }

        $enrollment = Enrollment::create([
            'tenant_id' => $user->tenant_id,
            'user_id' => $user->id,
            'course_id' => $courseId,
            'status' => 'active',
            'enrolled_at' => now(),
        ]);

        return response()->json([
            'message' => 'Successfully enrolled!',
            'enrollment' => $enrollment
        ], 201);
    }

    /**
     * Mark a lesson as completed for the authenticated user.
     */
    public function markLessonComplete(Request $request, $lessonId)
    {
        $user = $request->user();

        // Check if user is enrolled in the course that contains this lesson
        // (Middleware CheckEnrollment handles some of this, but we protect the store here)
        
        $progress = LessonProgress::updateOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lessonId],
            ['is_completed' => true, 'completed_at' => now()]
        );

        return response()->json([
            'message' => 'Lesson marked as complete!',
            'progress' => $progress
        ]);
    }

    /**
     * Unlock a course using a purchased bundle.
     */
    public function unlock(Request $request)
    {
        $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
        ]);

        $user = $request->user();
        $courseId = $request->course_id;

        // Check if already enrolled
        if (Enrollment::where('user_id', $user->id)->where('course_id', $courseId)->exists()) {
            return response()->json(['message' => 'Already enrolled in this course.'], 200);
        }

        // Check if user owns a bundle that contains this course
        $hasBundleAccess = BundlePurchase::where('user_id', $user->id)
            ->whereHas('bundle.courses', function($query) use ($courseId) {
                $query->where('courses.id', $courseId);
            })
            ->exists();

        if (!$hasBundleAccess) {
            return response()->json(['message' => 'You do not have a bundle that includes this course.'], 403);
        }

        // Create enrollment
        $enrollment = Enrollment::create([
            'tenant_id' => $user->tenant_id,
            'user_id' => $user->id,
            'course_id' => $courseId,
            'status' => 'active',
            'enrolled_at' => now(),
        ]);

        return response()->json([
            'message' => 'Course unlocked successfully!',
            'enrollment' => $enrollment
        ], 201);
    }
}
