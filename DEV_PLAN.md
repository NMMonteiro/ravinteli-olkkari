# Development Plan: Ravinteli Olkkari

## 1. Executive Summary
This document outlines the roadmap to transform the "Ravinteli Olkkari" prototype into a fully functional, production-ready web application. The goal is to move from static data and CDN-based styling to a robust architecture with a real database, secure authentication, and optimized performance.

## 2. Phase 1: Foundation & Infrastructure Cleanup
**Goal:** Standardize the codebase for professional development.
- [ ] **Migrate Tailwind CSS**: Remove the CDN link from `index.html` and install Tailwind locally via npm/PostCSS. This enables custom config, better performance, and IDE autocompletion.
- [ ] **Dependency Standardization**: Remove the `<script type="importmap">` from `index.html`. Ensure all libraries (React, Framer Motion, Router) are installed via `package.json` to avoid version conflicts and ensuring correct bundling.
- [ ] **TypeScript Hardening**: strict type checking to prevent future bugs.

## 3. Phase 2: Backend Integration (Supabase)
**Goal:** Replace static constants with dynamic, persistent data.
- [ ] **Database Setup**: Initialize a Supabase project.
- [ ] **Schema Design**:
    - `menu_items`: For dynamic menu management.
    - `events`: For the event calendar.
    - `bookings`: To store customer reservations.
    - `staff`: For the Chef Hire and Team sections.
    - `art_pieces`: For the gallery.
- [ ] **Authentication**: Implement Auth (likely via Magic Links or Social Login) for:
    - **Admin Access**: Only authorized users can see the `/admin` dashboard.
    - **User Profiles**: (Optional) For the Loyalty program.
- [ ] **Data Migration**: Upload existing mock data from `constants.ts` to the database.

## 4. Phase 3: Core Feature Implementation
**Goal:** Make the UI interactive and functional.
- [ ] **Dynamic Home & Menu**: Fetch data from Supabase.
- [ ] **Functional Booking System**: 
    - Create a form that writes to the `bookings` table.
    - Implement basic validation (date/time availability).
- [ ] **Admin Dashboard**: 
    - Build interface to Add/Edit/Delete Menu items and Events.
    - View incoming Bookings.
- [ ] **AI Chat Integration**: 
    - Connect `ChatScreen` to a backend function (Edge Function) that utilizes the `GEMINI_API_KEY` to provide real responses instead of mock text.

## 5. Phase 4: Polish & Optimization
**Goal:** Ensure a premium, production-quality user experience.
- [ ] **Image Optimization**: Replace direct valid URLs with storage buckets or optimized assets (WebP).
- [ ] **SEO & Metadata**: Add proper meta tags for social sharing and search indexing.
- [ ] **Performance**: Lazy load routes (code splitting) to speed up initial load.
- [ ] **PWA (Optional)**: Make the app installable on mobile devices.

## 6. Implementation Timeline (Estimated)
- **Phase 1**: 1-2 Days
- **Phase 2**: 2-3 Days
- **Phase 3**: 3-4 Days
- **Phase 4**: 1-2 Days
