# MyPlayer – Improvement Plan

This document tracks proposed structural and code-quality improvements. Items are grouped by area, with high‑leverage changes first.

> Legend:  
> - [ ] Planned  
> - [x] Done / implemented

---

## 1. Project Structure

- [x] Introduce a feature‑oriented folder layout under `src/`:
  - `src/app` – app shell (`App.tsx`, `index.tsx`).
  - `src/features/player` – player UI (controls, video form, visualizer, YouTube player, track info).
  - `src/features/playlist` – playlist UI (playlist, sidebar, related popups).
  - `src/components/common` – generic components (e.g. `Popup`).
  - `src/components/layout` – layout components (e.g. header/footer).
  - `src/store` – global state (YouTube/playlist store).
  - `src/styles` – CSS Modules.
- [x] Move `Popup` from `src/modules/utilities.tsx` into `src/components/common/Popup.tsx` and update imports.
- [x] Introduce a `public/` folder for static web assets:
  - `public/index.html` – HTML template used by Webpack.
  - `public/serviceworker.js`, `public/site.webmanifest`.
- [x] Introduce a `scripts/` folder for helper tooling and data (moved from `tools/`).

---

## 2. State Management & Data Model

- [ ] Split `YouTubeState` in `src/store/store.tsx` into conceptual slices:
  - Playback: `videoId`, `videoUrl`, `isPlaying`, `isVideoMode`, `repeat`.
  - Playlist: `playlist`, helpers for grouping and counting tracks.
  - UI: `isQRCodeModalVisible`, `isPastOrClear`, sidebar state (if promoted to global later).
- [ ] Add selector-style helpers in the store or a companion module:
  - `getPlayableTracks(playlist)`.
  - `getSubPlaylists(playlist)`.
  - `groupBySubPlaylist(playlist)`.
- [ ] Create a dedicated playlist service module (e.g. `src/store/playlistService.ts`) to encapsulate:
  - Adding/removing tracks.
  - Moving tracks between sub‑playlists.
  - Reordering tracks.
  - Creating/removing sub‑playlists.

---

## 3. App Shell & Event Handling

- [ ] Refactor touch/mouse event handling in `src/app/App.tsx`:
  - Use `useCallback` for `handleTouchStart` and the mouse‑over handler.
  - Add/remove exactly those callbacks in `useEffect` to ensure listeners are cleaned up.
  - Avoid stale closures by including relevant dependencies or using refs for `isSidebarOpen`.
- [ ] Prefer React event types (`React.TouchEvent`, `React.MouseEvent`) instead of global `TouchEvent` where feasible.

---

## 4. YouTube Integration

- [ ] Extract YouTube Data API calls (e.g. `fetchVideoTitle` from `src/features/player/control.tsx`) into `src/api/youtube.ts`:
  - Export a typed function `getVideoTitle(videoId: string): Promise<string | null>`.
  - Handle common errors (invalid ID, quota, network) in one place.
- [ ] Move the API key out of component code:
  - Use an environment variable (e.g. `process.env.YT_API_KEY` injected via Webpack DefinePlugin), or
  - A small config module that can be swapped without touching UI code.

---

## 5. Playlist Modeling

- [ ] Replace the magic `'subplaylist'` marker string with a shared constant, e.g. `SUBPLAYLIST_MARKER_ID`, exported from a single module.
- [ ] Centralize logic that filters out marker entries so components don’t manually check `track.id !== 'subplaylist'`.
- [ ] (Optional, larger refactor) Normalize playlist data:
  - `SubPlaylist { id, name }`.
  - `Track { id, title, subPlaylistId | null }`.
  - Store as separate collections or in a normalized structure inside the store.

---

## 6. Type Safety & React Patterns

- [ ] Tighten prop and event typing in components:
  - Use explicit `React.MouseEvent`, `React.ChangeEvent`, etc. in `sidebar.tsx`, `playList.tsx`, `control.tsx`.
  - Ensure callbacks have precise types instead of `any`.
- [ ] Introduce small domain types where useful:
  - `type SubPlaylistName = string;`
  - Literal types for special names like `'Main Playlist'`, `'**Untrack**'` exposed from one config module.

---

## 7. Player Component Encapsulation

- [ ] Extract a `useYouTubePlayer` hook from `src/features/player/youtubePlayer.tsx`:
  - Manages loading the iframe API script.
  - Handles creating/destroying the `YT.Player` instance.
  - Encapsulates repeat behavior, visibility tracking, and health checks.
  - Exposes a small, typed interface to the component (e.g. `loadVideo`, `play`, `pause`, `isReady`).
- [ ] Keep `YouTubePlayer` mostly declarative:
  - Subscribe to global store state.
  - Delegate imperative player management to the hook.

---

## 8. Logging & Dev Tooling

- [ ] Replace the global `console.log` override in `src/app/index.tsx` with a dedicated logger utility:
  - `src/utils/logger.ts` exporting `log(...args)` that:
    - Sends logs to `/log` only in development.
    - Delegates to `console.log` in all modes.
  - Use the logger in places where remote logging is needed, without touching the global console.

---

## 9. Repository Cleanup

- [x] Remove the legacy Electron runtime and packaging:
  - Delete `main.js`.
  - Remove Electron build scripts and `build` config from `package.json`.
  - Remove Electron-related dev dependencies from `package.json`.
- [ ] Uninstall Electron-related packages and refresh lockfile:
  - Run `npm uninstall electron electron-builder` and regenerate `package-lock.json` when convenient.
- [x] Move ad‑hoc tools into a dedicated folder:
  - `tools/*` → `scripts/*` (Python helper + JSON data).
- [x] Ensure documentation is consistent with the new structure:
  - `README.md` and `ARCHITECTURE.md` describe the app as web/PWA only (Electron is legacy only).
  - Paths in docs reflect `src/app`, `src/features`, `src/components`, `public/`, and `scripts/`.

