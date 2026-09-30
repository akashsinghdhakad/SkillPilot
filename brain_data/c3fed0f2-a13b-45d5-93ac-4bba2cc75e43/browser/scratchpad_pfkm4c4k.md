# Task Plan: Manual Verification of Certificate Branding and Issuance

- [x] Login as **admin@skillpilot.com** at `http://localhost:3000/login`
- [x] Navigate to `/admin/settings/branding`
- [x] Change **Brand Color** to `#FF4500` and click **Save Branding**
- [x] Refresh the page to confirm the brand color is saved
- [x] Logout and Login as **student@skillpilot.com**
- [x] Navigate to `http://localhost:3000/courses`
- [x] Find "Mastering Laravel" and click **Learn**
- [!] Verify **100% progress** and look for "Download Certificate" or "Claim Certificate" button
    - Found "Claim Certificate" button.
    - Progress appears as 100% in UI (lesson checkmarked).
- [ ] Click **Download Certificate** and verify the PDF is generated
    - **Issue**: "Claim Certificate" fails with 403 Forbidden.
    - **Backend Error**: `{"message":"Course lessons are not fully completed.","completed":0,"total":1}`.
    - **Observation**: The backend thinks 0/1 lessons are completed, but the UI shows the lesson as completed.
- [ ] Report the final success status
