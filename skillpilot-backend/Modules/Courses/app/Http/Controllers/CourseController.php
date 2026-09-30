<?php

namespace Modules\Courses\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Courses\Models\Course;
use Modules\Courses\Models\CourseSection;

class CourseController extends Controller
{
    /**
     * List all courses for the current tenant.
     */
    public function index()
    {
        $courses = Course::with('sections.lessons')
            ->withCount('lessons')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($courses);
    }

    /**
     * Create a new course.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:191',
            'description' => 'nullable|string',
            'price'       => 'nullable|numeric|min:0',
            'status'      => 'nullable|in:draft,published',
        ]);

        $course = Course::create([
            'tenant_id'   => $request->user()->tenant_id,
            'title'       => $request->title,
            'description' => $request->description,
            'price'       => $request->price ?? 0,
            'status'      => $request->status ?? 'draft',
        ]);

        return response()->json($course, 201);
    }

    /**
     * Get a single course.
     */
    public function show(Request $request, $id)
    {
        $course = Course::with(['sections.lessons'])->findOrFail($id);
        
        $user = $request->user();
        if ($user) {
            $completedLessonIds = \Modules\Enrollments\Models\LessonProgress::where('user_id', $user->id)
                ->where('is_completed', true)
                ->pluck('lesson_id')
                ->toArray();

            foreach ($course->sections as $section) {
                foreach ($section->lessons as $lesson) {
                    $lesson->is_completed = in_array($lesson->id, $completedLessonIds);
                }
            }
        }

        return response()->json($course);
    }

    /**
     * Update a course.
     */
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $request->validate([
            'title'       => 'sometimes|string|max:191',
            'description' => 'nullable|string',
            'price'       => 'nullable|numeric|min:0',
            'status'      => 'nullable|in:draft,published',
            'is_active'   => 'sometimes|boolean',
        ]);

        $course->update($request->only(['title', 'description', 'price', 'status', 'thumbnail', 'is_active']));

        return response()->json($course);
    }

    /**
     * Delete a course.
     */
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();
        return response()->json(['message' => 'Course deleted.']);
    }

    // ── Sections ────────────────────────────────────────────────────────────

    public function addSection(Request $request, $courseId)
    {
        $request->validate(['title' => 'required|string|max:191']);

        $course  = Course::findOrFail($courseId);
        $section = $course->sections()->create([
            'title'      => $request->title,
            'sort_order' => $course->sections()->count(),
            'is_active'  => true,
        ]);

        return response()->json($section, 201);
    }

    public function deleteSection($id)
    {
        $section = CourseSection::findOrFail($id);
        $section->delete();
        return response()->json(['message' => 'Section deleted.']);
    }

    public function toggleSectionStatus($id)
    {
        $section = CourseSection::findOrFail($id);
        $section->update(['is_active' => !$section->is_active]);
        return response()->json($section);
    }

    public function updateSection(Request $request, $id)
    {
        $request->validate(['title' => 'required|string|max:191']);
        $section = CourseSection::findOrFail($id);
        $section->update(['title' => $request->title]);
        return response()->json($section);
    }
}
