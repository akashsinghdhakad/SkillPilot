# Test Plan: Course Enrollment and Progress Tracking

- [ ] 1. Navigate to http://localhost:3000/courses (Course Catalog) [FAILED - 500 ERROR]
- [ ] 2. Verify courses are loaded and capture "course_catalog" screenshot [BLOCKED]
- [ ] 3. Click 'Enroll Now' on a course [PENDING]
...
### Findings
- Course Catalog shows empty (skeleton cards).
- Console logs show `AxiosError: Request failed with status code 500` for `api/courses` and `api/enrollments`.
- Direct access to `api/courses` Redirects to [login], suggesting auth issue.
- Attempting to re-login at `http://localhost:3000/login`.
- [ ] 4. Verify success toast and 'Go to Course' button
- [ ] 5. Navigate to Course Player (http://localhost:3000/courses/[id]/learn)
- [ ] 6. Test 'Mark As Complete'
- [ ] 7. Refresh and verify persistence, capture "course_player_completed" screenshot
- [ ] 8. Navigate to Student Dashboard (http://localhost:3000/dashboard)
- [ ] 9. Verify enrollment and capture "student_dashboard" screenshot
- [ ] 10. Return a report
