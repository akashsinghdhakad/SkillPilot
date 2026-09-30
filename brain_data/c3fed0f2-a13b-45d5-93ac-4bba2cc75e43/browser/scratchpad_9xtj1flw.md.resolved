# Course Enrollment and Player Verification

- [ ] Navigate to Course Catalog (http://localhost:3001/courses)
- [ ] Verify courses are displayed
- [ ] Enroll in a course (e.g., 'Advanced React')
- [ ] Verify 'Successfully enrolled!' toast
- [ ] Confirm redirection to Course Player (http://localhost:3001/courses/[id]/learn)
- [ ] Verify Course Player:
    - [ ] Course title is visible
    - [ ] Sidebar curriculum is visible and navigable
    - [ ] Clicking a lesson loads the content/video area
    - [ ] 'Mark as Complete' button exists
- [ ] Navigate to Student Dashboard (http://localhost:3001/dashboard)
- [ ] Verify enrolled course appears in 'Your Courses'
- [ ] Take screenshots of Course Player and Student Dashboard
- [ ] Final report

## Observations / Issues
- Attempts to reach `http://localhost:3001/courses`, `http://localhost:3000/courses`, `http://127.0.0.1:8000/api/courses`, and `https://www.google.com` (as test) were made.
- `https://www.google.com` worked, so the browser has internet connectivity.
- `localhost:3001`, `localhost:3000`, `127.0.0.1:8000`, `127.0.0.1:3001` all returned `ERR_CONNECTION_REFUSED`.
- The main agent history shows `curl http://localhost:8000/api/courses/1` worked previously, implying the backend was running.
- Possible that `npm run dev` and `php artisan serve` stopped or are not reachable from the browser's container.
