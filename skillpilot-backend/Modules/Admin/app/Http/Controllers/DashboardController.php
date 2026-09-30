<?php

namespace Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Orders\Models\Order;
use Modules\Enrollments\Models\Enrollment;
use App\Models\User;
use Modules\Courses\Models\Course;
use Modules\Enrollments\Models\LessonProgress;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get aggregate statistics for the current tenant.
     */
    public function getStats(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $cacheKey = "tenant_{$tenantId}_dashboard_stats";

        // Cache stats for 30 minutes to reduce database load
        $stats = Cache::remember($cacheKey, now()->addMinutes(30), function () use ($tenantId) {
            return [
                'revenue' => (float) Order::where('payment_status', 'paid')->sum('total_amount'),
                'total_enrollments' => Enrollment::count(),
                'active_students' => User::where('tenant_id', $tenantId)->count(),
                'completion_rate' => $this->calculateCompletionRate($tenantId),
            ];
        });

        return response()->json($stats);
    }

    /**
     * Get revenue breakdown for the last 30 days.
     */
    public function getRevenueChart(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $cacheKey = "tenant_{$tenantId}_revenue_chart";

        $data = Cache::remember($cacheKey, now()->addMinutes(60), function () {
            return Order::where('payment_status', 'paid')
                ->where('created_at', '>=', now()->subDays(30))
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as total'))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        });

        return response()->json($data);
    }

    /**
     * Get top performing courses based on enrollment and completion.
     */
    public function getCoursePerformance()
    {
        $courses = Course::withCount('enrollments')
            ->orderBy('enrollments_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'enrollments' => $course->enrollments_count,
                    'avg_progress' => $this->getCourseAvgProgress($course->id),
                ];
            });

        return response()->json($courses);
    }

    /**
     * Calculate global completion rate for the tenant.
     */
    private function calculateCompletionRate($tenantId)
    {
        $totalEnrollments = Enrollment::count();
        if ($totalEnrollments === 0) return 0;

        // Completion means all lessons in the enrollment's course are finished
        // This is a rough estimation for the dashboard
        $completedCount = 0;
        $enrollments = Enrollment::all();

        foreach ($enrollments as $enrollment) {
            $course = $enrollment->course;
            if (!$course) continue;
            
            $totalLessons = $course->lessons()->count();
            if ($totalLessons === 0) continue;

            $completedLessons = LessonProgress::where('user_id', $enrollment->user_id)
                ->whereIn('lesson_id', $course->lessons()->pluck('course_lessons.id'))
                ->where('is_completed', true)
                ->count();

            if ($completedLessons >= $totalLessons) {
                $completedCount++;
            }
        }

        return round(($completedCount / $totalEnrollments) * 100, 2);
    }

    /**
     * Get average progress for a specific course.
     */
    private function getCourseAvgProgress($courseId)
    {
        $enrollments = Enrollment::where('course_id', $courseId)->get();
        if ($enrollments->isEmpty()) return 0;

        $totalProgress = 0;
        foreach ($enrollments as $enrollment) {
            $course = $enrollment->course;
            $totalLessons = $course->lessons()->count();
            if ($totalLessons === 0) continue;

            $completedLessons = LessonProgress::where('user_id', $enrollment->user_id)
                ->whereIn('lesson_id', $course->lessons()->pluck('course_lessons.id'))
                ->where('is_completed', true)
                ->count();

            $totalProgress += ($completedLessons / $totalLessons) * 100;
        }

        return round($totalProgress / $enrollments->count(), 2);
    }
}
