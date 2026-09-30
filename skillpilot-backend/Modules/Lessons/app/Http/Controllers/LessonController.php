<?php

namespace Modules\Lessons\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Lessons\Models\CourseLesson;
use Modules\Courses\Models\CourseSection;
use Modules\Courses\Services\CourseAccessService;

class LessonController extends Controller
{
    protected $accessService;

    public function __construct(CourseAccessService $accessService)
    {
        $this->accessService = $accessService;
    }

    /**
     * Get a lesson by ID.
     */
    public function show(Request $request, $id)
    {
        $lesson = CourseLesson::with('section.course')->findOrFail($id);
        $user = $request->user();

        // Security Check: Does the user have access to this course?
        if (!$this->accessService->canAccess($user, $lesson->section->course)) {
            return response()->json([
                'message' => 'Access denied. You must be enrolled or have an active membership to view this lesson.',
                'course_id' => $lesson->section->course->id,
                'required_level' => $lesson->section->course->required_level
            ], 403);
        }

        return response()->json($lesson);
    }

    /**
     * Create a lesson in a section.
     */
    public function store(Request $request)
    {
        $request->validate([
            'section_id'   => 'required|integer|exists:course_sections,id',
            'title'        => 'required|string|max:191',
            'content_type' => 'required|in:video,pdf,text',
            'content_url'  => 'nullable|string|url',
            'content_file' => 'nullable|file|max:51200', // 50MB max for now
            'duration'     => 'nullable|integer',
        ]);

        $section = CourseSection::findOrFail($request->section_id);
        $contentPath = $request->content_url;

        if ($request->hasFile('content_file')) {
            $file = $request->file('content_file');
            $tenantId = $section->course->tenant_id;
            $path = "tenants/{$tenantId}/lessons";
            $contentPath = $file->store($path, 'public');
        }

        $lesson = CourseLesson::create([
            'section_id'   => $section->id,
            'title'        => $request->title,
            'content_type' => $request->content_type,
            'content_path' => $contentPath,
            'sort_order'   => $section->lessons()->count(),
            'duration'     => $request->duration,
        ]);

        return response()->json($lesson, 201);
    }

    /**
     * Update a lesson.
     */
    public function update(Request $request, $id)
    {
        $lesson = CourseLesson::findOrFail($id);
        
        $request->validate([
            'title'        => 'sometimes|required|string|max:191',
            'content_type' => 'sometimes|required|in:video,pdf,text',
            'content_url'  => 'nullable|string|url',
            'content_file' => 'nullable|file|max:51200',
            'duration'     => 'nullable|integer',
            'sort_order'   => 'sometimes|integer',
            'is_active'    => 'sometimes|boolean',
        ]);

        $contentPath = $request->content_url ?? $lesson->content_path;

        if ($request->hasFile('content_file')) {
            $file = $request->file('content_file');
            $tenantId = $lesson->section->course->tenant_id;
            $path = "tenants/{$tenantId}/lessons";
            $contentPath = $file->store($path, 'public');
        }

        $lesson->update(array_merge(
            $request->only(['title', 'content_type', 'duration', 'sort_order', 'is_active']),
            ['content_path' => $contentPath]
        ));

        return response()->json($lesson);
    }

    /**
     * Delete a lesson.
     */
    public function destroy($id)
    {
        $lesson = CourseLesson::findOrFail($id);
        $lesson->delete();
        return response()->json(['message' => 'Lesson deleted.']);
    }

    /**
     * Toggle lesson active status.
     */
    public function toggleStatus($id)
    {
        $lesson = CourseLesson::findOrFail($id);
        $lesson->update(['is_active' => !$lesson->is_active]);
        return response()->json($lesson);
    }
}
