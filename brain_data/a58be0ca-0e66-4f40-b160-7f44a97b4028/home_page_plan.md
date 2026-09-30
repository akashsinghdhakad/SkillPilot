# SWHP Home Page Implementation Plan

This document outlines the architecture, components, and tasks required to build the landing page (`/`) for the Single Window Health Portal.

## 1. Architectural Strategy
Following the enterprise architecture, the Home Page will be orchestrated in the App Router's root `page.tsx`. Its heavy UI sections will be broken down into modular, highly-styled components within a dedicated `home` feature module.

**Target Path:** `src/app/page.tsx`
**Feature Module:** `src/features/home/`

## 2. Directory Structure Addition
```text
src/
+-- app/
¦   +-- page.tsx                  # Main entry point assembling Home components
+-- features/
    +-- home/
        +-- components/
            +-- HeroSection.tsx   # Main banner with Call-To-Action
            +-- FeaturesGrid.tsx  # Explaining SWAN and aggregated payments
            +-- CouncilList.tsx   # Displaying the 5 integrated councils
            +-- PortalFooter.tsx  # Standard links and copyrights
```

## 3. Implementation Tasks

### Step 1: Feature Scaffolding
- [ ] Run `mkdir src/features/home`, `mkdir src/features/home/components` inside your frontend repository.

### Step 2: Build UI Components (Tailwind CSS)
- [ ] **`HeroSection.tsx`**: Build a full-width banner with a modern background/gradient. Include a prominent "Login / Apply Now" button that routes users to the `/login` page.
- [ ] **`FeaturesGrid.tsx`**: Build a responsive 3-column grid (`grid grid-cols-1 md:grid-cols-3`). Use FontAwesome icons to visually represent:
  1. *One Profile, Many Applications* (Auto-filling legacy forms)
  2. *Unified SWAN Tracking* (Single number tracking)
  3. *Consolidated Payments* (One payment gateway)
- [ ] **`CouncilList.tsx`**: Create a clean, card-based layout listing the integrated systems: Nursing, Paramedical, Ayurvedic, Homeopathy, and MP State Dental Councils.
- [ ] **`PortalFooter.tsx`**: Add standard government portal copyrights, privacy policy links, and support contact info.

### Step 3: Page Assembly
- [ ] Open `src/app/page.tsx`.
- [ ] Clear the default Next.js boilerplate.
- [ ] Import and stack the components sequentially: `<HeroSection />`, `<FeaturesGrid />`, `<CouncilList />`, and `<PortalFooter />`.

### Step 4: SEO & Metadata
- [ ] In `src/app/page.tsx`, export the Next.js `metadata` object to ensure SEO best practices:
  ```typescript
  import type { Metadata } from 'next';

  export const metadata: Metadata = {
    title: "Home | Single Window Health Portal",
    description: "Apply for services across multiple health councils using a single profile and unified tracking system."
  };
  ```
