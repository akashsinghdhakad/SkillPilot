# Course & Lesson Management Revision Plan

Enhance the curriculum builder with better control over content visibility, deletion safety, and real-time previews.

## User Review Required

> [!IMPORTANT]
> - **Soft Delete Behavior**: When a course is soft-deleted, should sections and lessons also be soft-deleted automatically? (Standard practice: Yes).
> - **Preview Library**: For PDF previews, we will use a standard browser embed. For videos, we'll use an HTML5 player for files and an iframe for URLs.

## Proposed Changes

### [Backend] [Database & Models]

#### [NEW] [add_soft_deletes_and_active_status.php](file:///d:/learning/SkillPilot/skillpilot-backend/database/migrations/2026_03_18_170000_add_soft_deletes_and_active_status.php)
- Add `deleted_at` to `courses`, `course_sections`, `course_lessons`.
- Add `is_active` (boolean, default true) to `course_sections`, `course_lessons`.

#### [MODIFY] [Course/Section/Lesson Models](file:///d:/learning/SkillPilot/skillpilot-backend/Modules/)
- Add `use SoftDeletes`.
- Include `is_active` in `$fillable`.

---

### [Backend] [Controllers & API]

#### [MODIFY] [CourseController.php](file:///d:/learning/SkillPilot/skillpilot-backend/Modules/Courses/app/Http/Controllers/CourseController.php)
- Add `deleteSection($id)` and `toggleSectionStatus($id)`.
- Update `update()` to allow status changes regardless of publication status.

#### [MODIFY] [LessonController.php](file:///d:/learning/SkillPilot/skillpilot-backend/Modules/Lessons/app/Http/Controllers/LessonController.php)
- Add `deleteLesson($id)` and `toggleLessonStatus($id)`.

---

### [Frontend] [Curriculum Interface]

#### [MODIFY] [EditCoursePage](file:///d:/learning/SkillPilot/skillpilot-frontend/src/app/(dashboard)/instructor/courses/[id]/edit/page.tsx)
- Implement `deleteSection` and `deleteLesson` handlers.
- Add toggle switches for `is_active` on sections and lessons.
- Implement **Media Preview** components for:
    - YouTube/Vimeo URLs (Iframe).
    - Uploaded Video files (Video element).
    - PDF files (Embed/New Tab link).

#### [MODIFY] [LessonFormModal](file:///d:/learning/SkillPilot/skillpilot-frontend/src/components/instructor/courses/LessonFormModal.tsx)
- Add "Active" checkbox.
- Display a quick preview area when a URL is pasted or a file is selected.

---

### [Frontend] [Student View]

#### [MODIFY] [CourseCatalog/Catalog](file:///d:/learning/SkillPilot/skillpilot-frontend/src/app/(dashboard)/courses/page.tsx)
- Ensure only `is_active` sections and lessons are visible to students.

## Verification Plan

### Automated Tests
- `php artisan migrate` to verify schema changes.
- Manual API tests to confirm `deleted_at` is populated on delete.
- Verify `is_active=false` items are excluded from student-facing responses.

### Manual Verification
- Instructor: Add section -> Toggle inactive -> Confirm it dims/hides in UI.
- Instructor: Upload video -> Confirm preview appears instantly.
- Instructor: Delete lesson -> Confirm it disappears but remains in DB (soft-delete).
