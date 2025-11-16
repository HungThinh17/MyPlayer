# MyPlayer Improvement Plan

This document outlines incremental improvements for evolving MyPlayer into a robust PWA-first YouTube playlist player while keeping within platform and provider constraints.

## 1. PWA Foundation
**Goal:** Make MyPlayer a clean, installable PWA where the shell and playlists work offline, while playback remains online-only.

### 1.1 Manifest (`site.webmanifest`)
- Align `start_url` and `scope` with the real deployment path (root vs `/MyPlayer/`) and keep them consistent with `index.html` and service worker scope.
- Add additional icons (at least `512x512`, optionally `maskable`) and ensure all exist under `resources/` and are copied by Webpack.
- Remove non-standard fields (`offline_enabled`) or replace them with documented behavior in `README.md`.
- Either implement `share_target` handling (read `url` param on load and pre-fill/play) or remove the `share_target` block until supported.

### 1.2 Service Worker (`serviceworker.js`)
- Limit pre-cached URLs to same-origin app shell assets (HTML, JS bundles, CSS, icons); do not cache YouTube or other third-party URLs.
- Implement a cache strategy:
  - Cache-first for static assets (JS/CSS/icons).
  - Network-first (with cache fallback) for navigation/HTML so updates are not stuck.
- Add an `activate` handler to delete old caches when `CACHE_NAME` changes.
- Ensure the SW file path and scope match the desired app scope (root vs subpath).

### 1.3 Registration & Environment (`src/index.tsx`)
- Register the service worker only in production (`process.env.NODE_ENV === 'production'`), and no-op in development.
- Log registration success/failure and (optionally) detect new versions to suggest a reload when an updated SW is installed.

### 1.4 Offline Behavior Documentation
- Define and document the offline model:
  - App shell + playlists + metadata work offline.
  - YouTube playback and metadata fetching require an active network connection.
- Add a short “PWA/Offline behavior” section to `README.md` describing this clearly, plus a note about known iOS background limitations.

## 2. Playback & Background Behavior
- Centralize player control logic around `useYouTubeStore` so play/pause/next/prev actions are consistent across components.
- Integrate the Media Session API using `currentVideo` (lock-screen metadata, play/pause/next/previous handlers).
- Review and tune background recovery logic in `youtubePlayer.tsx` to reduce complexity while staying resilient to common stall cases.

## 3. Playlist & Data Management
- Clarify playlist model (sub-playlists, favorites, ordering) and reflect it in `store.tsx`.
- Consider migrating playlist persistence from `localStorage` to IndexedDB for scalability.
- Add optional export/import of playlist data (JSON) for backup and cross-device reuse.

## 4. UX & Controls
- Improve clipboard/paste flow to surface clear feedback when clipboard access is unavailable or fails.
- Enhance playlist and track browsing UX in `sidebar`, `playList`, and `trackInfo` (filtering, searching, sorting).
- Add small, contextual hints about platform background-playback limitations (especially iOS).

## 5. Quality, Testing & Tooling
- Introduce a lightweight test setup (Jest + React Testing Library) and wire `npm test`.
- Add targeted tests for `store.tsx`, `youtubePlayer.tsx` behaviors, and critical playlist logic.
- Optionally add basic linting/formatting (ESLint + Prettier) aligned with existing style, and document it in `AGENTS.md`/`README.md`.
