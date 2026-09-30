# Frontend Implementation Plan - Phase 4

This plan outlines the development of the SkillPilot frontend using Next.js 15, Tailwind CSS 4, and Framer Motion for a premium user experience.

## User Review Required
> [!IMPORTANT]
> The styling will prioritize a "WOW" factor with dark mode support, glassmorphism, and smooth transitions. I will use **Lucide React** for icons and **Framer Motion** for animations.

## Proposed Changes

### 1. Foundation & Utilities
- **Auth Context**: Manage user sessions and tenant information.
- **API Client**: Axios instance configured with base URL and interceptors for Bearer tokens.
- **Design System**: Global Tailwind 4 configurations and a set of reusable UI components (Button, Input, Card, Modal).

### 2. Authentication Flow
- **Login**: Secure login with tenant selection support (or auto-resolve).
- **Registration**: Multi-step registration including tenant creation for instructors.

### 3. Core Layouts
- **Public Layout**: Simple header/footer for landing pages.
- **Dashboard Layout**: 
  - Sidebar for navigation.
  - Header with breadcrumbs and user profile.
  - Responsive container for main content.

### 4. Role-Based Dashboards

#### 🎓 Student Dashboard
- **Course Library**: Browse and filter courses.
- **My Courses**: List of purchased/enrolled courses.
- **Learning Interface**: Video/Content player with progress tracking.
- **Certificates**: View and download earned certificates.

#### 👨‍🏫 Instructor Dashboard
- **Course Manager**: Create/Edit courses and pricing.
- **Curriculum Builder**: Drag-and-drop (simulated or simplified) interface for sections and lessons.
- **Earning Stats**: Overview of course sales and student enrollment.

#### 🛠️ Administrator Dashboard
- **Tenant Management**: List and monitor tenant health.
- **Commerce Control**: Manage global subscription packages and licenses.

## Verification Plan
### Manual Verification
- Test login/register flow across different roles.
- Verify multi-tenant data isolation visually (logging in as different users).
- Test responsiveness on mobile and tablet views.
- Walk through the checkout and course completion flow.
