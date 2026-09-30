# SkillPilot System Architecture

SkillPilot is a multi-tenant Learning Management System (LMS) built with a focus on modularity, scalability, and premium user experience.

## 🏗️ Overview
The system follows a decoupled Client-Server architecture:
- **Frontend**: Next.js 15 (App Router) - SPA feel with Server-Side rendering benefits.
- **Backend**: Laravel 12 - Modular API-only backend.
- **Database**: Single PostgreSQL/MySQL database with tenant-level isolation.

---

## 🛡️ Multi-Tenancy Design
We use a **Single Database, Shared Schema** approach for cost-efficiency and easier maintenance.

### Isolation Strategy
- **Global Scopes**: Every tenant-aware model uses a `BelongsToTenant` trait.
- **Tenant Resolution**: Resolved via a custom `X-Tenant-Id` header or the authenticated user's `tenant_id`.
- **Tenant Identification**: Each tenant has a unique `slug` (e.g., `acme.skillpilot.com`).

---

## 📦 Backend Architecture (Laravel)
The backend is organized into domain-driven modules using `nwidart/laravel-modules`.

### Key Modules
| Module | Responsibility |
|--------|----------------|
| **Core/Tenants** | Workspace management and license enforcement. |
| **Auth** | Unified authentication via Laravel Sanctum. |
| **Courses/Lessons** | Curriculum management and content delivery. |
| **Progress** | Real-time tracking of student learning states. |
| **Certificates** | Automated generation of unique PDFs/Serial Nos. |
| **Commerce** | Orders, Payments, and Subscription Packages. |

---

## 🎨 Frontend Architecture (Next.js)

The frontend is built for performance, modularity, and a premium "WOW" factor.

### Tech Stack Deep Dive
- **Core**: Next.js 15 (App Router) for hybrid rendering (SSR/ISR/CSR).
- **Styling**: Tailwind CSS 4 using a CSS-only configuration for faster builds and better DX.
- **State Management**: Zustand with the `persist` middleware to handle session persistence across reloads.
- **Micro-Animations**: Framer Motion for complex layout transitions and `motion` components.
- **Data Fetching**: Axios-based interceptors for centralized token and tenant ID management.

### Component Design Pattern
We follow an Atomic Design-inspired hierarchy:
- **`src/components/ui` (Atoms)**: Highly reusable, stateless design tokens like `Button`, `Input`, `Card`, and `Badge`.
- **`src/components/shared` (Molecules)**: Reusable functional components like `Sidebar`, `UserNav`, and `DataTable`.
- **`src/app/(dashboard)/components` (Organisms)**: Domain-specific components like `CourseBuilder` or `ProgressStats`.

### State Management Lifecycle
1. **App Initialization**: Persistent Zustand store checks `localStorage` for tokens.
2. **Auth Interceptor**: Every API call via `src/lib/api.ts` automatically appends:
    - `Authorization: Bearer <token>`
    - `X-Tenant-Id: <id>` (Critical for multi-tenant data isolation).
3. **Route Protection**: Middleware and `ProtectedLayouts` handle redirection if the user is not authenticated for their role.

### Dashboard Routing Structure
- `(auth)`: Unauthenticated routes (Login/Register).
- `(dashboard)`: Core application shell.
    - `/student`: Course consumption and progress views.
    - `/instructor`: Course management and analytics.
    - `/admin`: Global tenant and package management.

---

## 🚦 Security Flow
1. **Request**: Frontend sends `Bearer token` + `X-Tenant-Id`.
2. **Middleware**: `ResolveTenant` sets the global tenant context.
3. **ORM**: Eloquent applies `TenantScope` to all queries automatically.
4. **Validation**: API ensures the user belongs to the requested tenant.
