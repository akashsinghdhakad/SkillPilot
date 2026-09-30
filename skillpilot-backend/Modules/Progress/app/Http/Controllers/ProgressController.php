<?php

namespace Modules\Progress\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Progress\Models\CourseProgress;
use Modules\Lessons\Models\CourseLesson;
use Modules\Courses\Models\Course;

class ProgressController extends Controller
{
    /**
     * Get progress for a specific course.
     */
    public function show(Request $request, $courseId)
    {
        $userId = $request->user()->id;
        
        $completedLessons = CourseProgress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->whereNotNull('completed_at')
            ->pluck('lesson_id');

        $totalLessonsCount = CourseLesson::whereHas('section', function($q) use ($courseId) {
            $q->where('course_id', $courseId);
        })->count();

        return response()->json([
            'completed_lessons' => $completedLessons,
            'completed_count'   => $completedLessons->count(),
            'total_count'       => $totalLessonsCount,
            'percentage'        => $totalLessonsCount > 0 
                ? round(($completedLessons->count() / $totalLessonsCount) * 100, 2) 
                : 0
        ]);
    }

    /**
     * Mark a lesson as completed.
     */
    public function complete(Request $request)
    {
        $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
            'lesson_id' => 'required|integer|exists:course_lessons,id',
        ]);

        $userId = $request->user()->id;

        $progress = CourseProgress::updateOrCreate(
            [
                'user_id'   => $userId,
                'course_id' => $request->course_id,
                'lesson_id' => $request->lesson_id,
            ],
            [
                'completed_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Lesson marked as completed.',
            'progress' => $progress
        ]);
    }
}
