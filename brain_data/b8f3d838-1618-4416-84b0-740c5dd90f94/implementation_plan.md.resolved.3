# [Updated] Phase 5: Refinement & Real Data Integration

This phase transitions to a fully functional platform with multi-format content support and premium player experience.

## User Review Required

> [!IMPORTANT]
> - **Multi-Format Support**: I will implement rendering logic for Video (YouTube/Vimeo/Internal), PDF (Embed), and Quizzes (JSON-based question rendering).
> - **Collapsible Player UI**: The sidebar will use `framer-motion` for smooth toggle transitions.
> - **Real Stats**: All dashboards will now fetch from the API.

## Proposed Changes

### [Backend] Dashboard & Lessons

#### [NEW] [DashboardController](file:///d:/learning/SkillPilot/skillpilot-backend/app/Http/Controllers/DashboardController.php)
- Unified `stats()` endpoint:
    - **Student**: Enrollment count, certificates, estimated hours.
    - **Instructor**: Revenue summary, total students.
    - **Admin**: Global platform stats.

#### [MODIFY] [CourseLesson Model](file:///d:/learning/SkillPilot/skillpilot-backend/Modules/Lessons/app/Models/CourseLesson.php)
- No structural changes needed (already has `content_type`), but will ensure seeding/data handles Quiz JSON.

---

### [Frontend] Premium Course Player

#### [NEW] [Course Player](file:///d:/learning/SkillPilot/skillpilot-frontend/src/app/(dashboard)/courses/%5Bid%5D/learn/page.tsx)
- **Collapsible Sidebar**: Toggleable curriculum list using `framer-motion`.
- **Content Switching**: 
    - `VideoPlayer`: For YouTube/URL playback.
    - `PDFViewer`: Embed view for documents.
    - `QuizRenderer`: Interactive question component.

#### [MODIFY] [Course Catalog](file:///d:/learning/SkillPilot/skillpilot-frontend/src/app/(dashboard)/courses/page.tsx)
- Integration with `GET /api/courses` and enrollment buttons.

---

### [Frontend] Data Integration

#### [MODIFY] [Dashboards](file:///d:/learning/SkillPilot/skillpilot-frontend/src/app/(dashboard)/dashboard/page.tsx)
- Replace all mock `0` constants with API fetched state.

## Verification Plan

### Automated Tests
- `php artisan test` to verify role-based stat access.

### Manual Verification
1. Open Course Player: Toggle sidebar, verify content switches from Video to PDF correctly.
2. Complete Quiz: Verify the "Mark Complete" triggers after finishing a quiz.
3. Dashboard: Compare stats with backend database records.
