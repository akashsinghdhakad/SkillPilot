# Lesson Management Implementation Plan

Add the ability for instructors to create and manage lessons (video, PDF, text) within course sections.

## User Review Required

> [!IMPORTANT]
> - Lessons will support Video (URL or upload), PDF, and Text content.
> - File uploads will be stored in the `public` disk by default.
> - We will use a Modal-based form in the Course Studio to add lessons to each section.

## Proposed Changes

### [Backend] [Lessons Module]

#### [MODIFY] [LessonController.php](file:///d:/learning/SkillPilot/skillpilot-backend/Modules/Lessons/app/Http/Controllers/LessonController.php)
- Update `store` and `update` to handle file uploads (video/PDF).
- Add validation rules for different content types.
- Ensure `sort_order` is handled correctly.

#### [MODIFY] [api.php](file:///d:/learning/SkillPilot/skillpilot-backend/Modules/Lessons/routes/api.php)
- Ensure routes are protected by `role:instructor,admin`.

---

### [Frontend] [Course Studio]

#### [NEW] [LessonFormModal.tsx](file:///d:/learning/SkillPilot/skillpilot-frontend/src/components/instructor/courses/LessonFormModal.tsx)
- A modal component to create/edit lessons.
- Supports Title, Type dropdown, and content input/file upload.

#### [MODIFY] [page.tsx (Course Edit)](file:///d:/learning/SkillPilot/skillpilot-frontend/src/app/(dashboard)/instructor/courses/[id]/edit/page.tsx)
- Add "Add Lesson" button inside each section.
- Display a list of lessons under each section.
- Handle state updates after lesson creation/deletion.

## Verification Plan

### Automated Tests
- `php artisan test` (after adding new Lesson feature tests).
- Verify file uploads are correctly stored in the filesystem and database.

### Manual Verification
1. Open Course Studio for an existing course.
2. Add a new section.
3. Inside the section, click "Add Lesson".
4. Fill in details and upload a file.
5. Verify the lesson appears in the curriculum list and the file is accessible.
