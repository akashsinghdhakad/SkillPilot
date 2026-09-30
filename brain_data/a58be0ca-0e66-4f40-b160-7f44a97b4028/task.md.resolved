# SWHP Frontend Implementation Tasks

This task list serves as the actionable checklist for building the SWHP React frontend using an Enterprise-Grade Feature-Based Architecture and Tailwind CSS.

## 1. Environment & React Router Setup
- [ ] Initialize the React application (`npm create vite@latest swhp-frontend -- --template react-ts`).
- [ ] Install required dependencies (`react-router-dom`, `tailwindcss`, `axios`, `@tanstack/react-query`, `@fortawesome/react-fontawesome`).
- [ ] Setup Tailwind CSS configuration (`npx tailwindcss init -p`).
- [ ] Create the strict enterprise folder structure (`pages`, `providers`, `features`, `shared/components`, `services`, `hooks`, `lib`, `store`, `types`).
- [ ] Create `src/lib/api.ts` to configure the base `axios` instance.
- [ ] Implement `src/providers/Providers.tsx` to wrap `QueryClientProvider` and `AuthProvider`.
- [ ] Configure React Router v6 in `src/pages/router.tsx` and integrate it into `App.tsx`.

## 2. Authentication & Profile Features (`features/auth`, `features/profile`)
- [ ] Create `authService.ts` inside `features/auth/services/` containing API calls (login, register).
- [ ] Build the `Login` and `Register` UI components styled with Tailwind utility classes.
- [ ] Implement `hooks/useAuth.ts` wrapping React Query mutations for authentication.
- [ ] Implement legacy account mapping UI (`AccountMapping`) utilizing custom Tailwind modals.
- [ ] Develop the `UserProfile` component inside `features/profile/components`.

## 3. Service Selection Feature (`features/services`)
- [ ] Build the `ServiceList` component, rendering available legacy services using custom Tailwind card layouts.
- [ ] Create `services/swanService.ts` to handle the SWAN creation API call.
- [ ] Implement custom hook `hooks/useSwan.ts` using React Query to submit selected services and store the SWAN.

## 4. iFrame Orchestration Feature (`features/application`)
- [ ] Create the `ServiceIframe` wrapper component for loading individual legacy forms.
- [ ] Implement the `ApplicationOrchestrator` to manage the queue, visualizing progress.
- [ ] Create `hooks/usePostMessage.ts` to add the `window.addEventListener('message')` listener.
- [ ] Implement strict `event.origin` validation and verify the `eventType === 'FormCompleted'` and `payload.swan` match.

## 5. Payment & Tracking Features (`features/payment`, `features/tracking`)
- [ ] Create `services/paymentService.ts` to handle fee lookups and payment gateway redirections.
- [ ] Build the `FeeSummary` component to fetch and display the aggregated fee breakdown using React Query.
- [ ] Develop the `TrackingTable` dashboard utilizing Tailwind grid/table layouts, populated via `useQuery` fetching real-time status.

## 6. Security & Finalization
- [ ] Integrate CAPTCHA into public auth views.
- [ ] Ensure all forms use strict validation and handle API errors gracefully, showing Tailwind-styled alert banners.
- [ ] Verify CSRF defenses and ensure no sensitive data is placed in localStorage.
