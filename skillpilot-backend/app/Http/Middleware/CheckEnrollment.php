<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckEnrollment
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Check if user is admin or instructor of the course
        if ($user->hasRole(['admin', 'instructor'])) {
            return $next($request);
        }

        $courseId = $request->route('course');
        $lessonId = $request->route('lesson');

        if ($lessonId) {
            $lesson = \Modules\Lessons\Models\CourseLesson::find($lessonId);
            if ($lesson && $lesson->section && $lesson->section->course) {
                $courseId = $lesson->section->course_id;
            }
        }

        if ($courseId) {
            $isEnrolled = \Modules\Enrollments\Models\Enrollment::where('user_id', $user->id)
                ->where('course_id', $courseId)
                ->whereIn('status', ['active', 'completed'])
                ->exists();

            if (!$isEnrolled) {
                return response()->json(['message' => 'You are not enrolled in this course.'], 403);
            }
        }

        return $next($request);
    }
}
