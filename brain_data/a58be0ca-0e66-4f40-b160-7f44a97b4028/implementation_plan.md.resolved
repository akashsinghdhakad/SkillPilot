# Single Window Health Portal (SWHP) Implementation Plan

Based on the analysis of the Business Requirements Document (BRD) and Technical Design Document (TDD) for the Single Window Health Portal (SWHP), the following is a comprehensive plan to build and integrate the system.

## 1. Project Overview
SWHP is a centralized citizen-facing gateway that aggregates health services from five legacy systems (NHS, FDA, PCPNDT, NDPS, Medical Council) into a unified interface. 
- **Tech Stack:** React JS (Frontend), ASP.NET Core with C# (Backend API Gateway), MS SQL Server (Database).
- **Architecture:** Thin aggregation layer with legacy system processing. Key mechanisms include centralized identity, auto-login via iFrames, `postMessage` cross-origin events, and a consolidated payment gateway with parallel API syncing.

---

## 2. Implementation Phases

### Phase 1: Environment Setup & Database Initialization
*Objective: Set up the project foundation and database schema.*
- [ ] **Project Scaffolding:**
  - Initialize ASP.NET Core Web API project.
  - Initialize React JS project (without heavy state management tools like Redux).
- [ ] **Database Schema Design (MS SQL Server):**
  - Create `Users`, `UserProfiles`, `LinkedAccounts` tables for Identity management.
  - Create `SWAN_Transactions` and `SWAN_Services` tables for unified payment and session orchestration.
  - Create `EmailVerificationTokens` and `PasswordResetTokens` tables.
- [ ] **Infrastructure Configuration:**
  - Setup environment variables (JWT secret, DB connection strings, API keys).
  - Configure MS SQL Server Agent for reconciliation background jobs.

### Phase 2: Core Backend Services (ASP.NET Core API Gateway)
*Objective: Build the API gateway serving the frontend and communicating with legacy systems.*
- [ ] **Authentication & Identity Management:**
  - Implement `/api/v1/auth/signup`, `verify-email`, `signin`, and `forgot-password`.
  - Implement secure JWT issuance (HS256/RS256) and SHA-512 password hashing.
  - Implement legacy account mapping `/api/v1/auth/map-account` utilizing server-to-server API calls.
- [ ] **Profile Management:**
  - Implement `/api/v1/profile` (GET/PUT) to store common demographic fields.
- [ ] **SWAN Generation & iFrame Auto-Login:**
  - Implement `/api/v1/swan/create` to generate unique SWAN numbers.
  - Implement `/api/v1/swan/{swan}/autologin/{serviceId}` to fetch one-time auto-login URLs from legacy systems.
- [ ] **Consolidated Payment Engine:**
  - Implement `/api/v1/swan/{swan}/fees` with parallel tasks (`Task.WhenAll`) to aggregate fees.
  - Implement `/api/v1/payment/initiate` and `/api/v1/payment/callback`.
  - Implement concurrent parallel API calls to legacy systems to update payment status (`/api/v1/payment/update-status`).
- [ ] **Application Tracking:**
  - Implement `/api/v1/tracking/{swan}` to fetch real-time application statuses across legacy systems.

### Phase 3: Frontend Development (React JS)
*Objective: Build the UI elements enforcing sequential forms and capturing `postMessage` events.*
- [ ] **Auth & Profile Modules:**
  - Build views for Sign-Up, Sign-In, OTP/Email Verification, and Profile editing.
  - Ensure JWT storage is secure and integrated into Axios/Fetch interceptors.
- [ ] **Service Selection Module:**
  - Implement UI to select one or more legacy health services and trigger SWAN generation.
- [ ] **iFrame Orchestration Module:**
  - Develop the `iFrame` wrapper component.
  - Implement the `window.addEventListener('message')` listener for the `FormCompleted` event.
  - Secure the event listener by strictly validating `event.origin`.
  - Manage the sequential progression from one service iFrame to the next upon success.
- [ ] **Unified Payment Module:**
  - Build UI to display aggregated fees.
  - Integrate with the payment gateway redirect flow.
- [ ] **Tracking Dashboard:**
  - Implement dashboard to display application statuses grouped by service.

### Phase 4: Integration Contracts & Legacy System Enhancements
*Objective: Ensure legacy systems comply with the SWHP wrapper architecture.*
- [ ] **Security Hardening (Legacy Side):**
  - Configure `Content-Security-Policy: frame-ancestors 'self' https://swhp.mponline.gov.in`.
  - Enforce `SameSite=None; Secure` cookies for session preservation within cross-origin iFrames.
- [ ] **Legacy API Exposures (Legacy Side):**
  - `/api/v1/auth/autologin`
  - `/api/v1/payment/fees`
  - `/api/v1/payment/update-status`
  - `/api/v1/application/status`
- [ ] **postMessage Emission (Legacy Side):**
  - Implement `window.parent.postMessage` to emit `{ source, eventType: "FormCompleted", payload }` upon successful form submission.
- [ ] **Disable In-App Payments:**
  - Hide/Disable payment buttons inside legacy forms when loaded via the auto-login URL.

### Phase 5: Automated Payment Reconciliation
*Objective: Handle discrepancies and network failures between SWHP and Legacy Systems.*
- [ ] **Stored Procedure:** Write a SQL stored procedure querying `SWAN_Services` with `SyncStatus = 'Pending'` and `PaymentStatus = 'Successful'`.
- [ ] **SQL Server Agent Job:** Schedule the daily reconciliation job to call the backend retry endpoint `/api/v1/payment/sync-retry`.
- [ ] **Failure Escalation:** Configure thresholds for changing `SyncStatus` to `ManualReview` and configure Database Mail alerts for the finance team.

### Phase 6: Testing & Quality Assurance
*Objective: Validate end-to-end flows, security, and performance.*
- [ ] **Cross-Origin & iFrame Testing:** Verify cookie sharing, Safari/Chrome third-party cookie restrictions, and `postMessage` execution.
- [ ] **Concurrency Testing:** Ensure parallel legacy API calls (`Task.WhenAll`) handle varying response times correctly without race conditions.
- [ ] **Security Audits:** Validate JWT, X-API-KEY implementations, CSP headers, and verify that invalid `postMessage` origins are discarded.

---

## Next Steps
Please review the proposed implementation plan. Let me know if you would like me to begin by setting up the project scaffolding (ASP.NET Core & React), defining the database schema scripts, or starting with the backend API interfaces.
