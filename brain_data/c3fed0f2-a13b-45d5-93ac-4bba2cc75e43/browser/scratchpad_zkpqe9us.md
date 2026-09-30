# Verification Checklist

- [x] Navigate to http://localhost:3000/instructor/courses. (Connection refused)
- [ ] Verify each course has a 'Switch' (Active/Inactive) and a 'Trash' (Delete) icon.
- [ ] Click the toggle for a course and verify it changes state visually.
- [ ] Click 'Edit' on a course (e.g. Course 1) to go to http://localhost:3000/instructor/courses/1/edit.
- [ ] In the Edit page, find the 'Course Curriculum' section.
- [ ] Verify each lesson has an 'Eye' (View) and 'Edit' (Pencil) icon clearly visible.
- [ ] Click the 'Edit' icon for a lesson.
- [ ] Verify 'Lesson Title' and other fields in the modal are pre-filled.
- [ ] Close the modal.
- [ ] Try to rename a section by clicking the Edit icon next to the section title.
- [ ] Verify that an input field appears and you can type a new name.

**Notes:**
- Attempted to access `http://localhost:3000/instructor/courses` and `http://localhost:8000/api/courses`.
- Encountered `ERR_CONNECTION_REFUSED` for both.
- It appears the servers were stopped (as noted in the history "stop artisan server") and not restarted. I do not have tools to start the servers.
