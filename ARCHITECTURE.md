# MyPlayer Architecture

## 1. Overview

MyPlayer is a small YouTube-focused media player that runs as a web/PWA application built from the `dist/` bundle.

The application emphasizes:

- Background playback where the browser/OS allows.
- Simple, keyboard- and click-driven controls.
- Local playlist management with export/import.

Core technologies:

- UI: React 18 + TypeScript.
- State: Custom React Context store (`YouTubeProvider`).
- Playback: YouTube IFrame Player API + YouTube Data API (for titles).
- Packaging: Webpack (no Electron).
- PWA: Service worker + web manifest.

---

## 2. High-Level Architecture

At a high level, MyPlayer consists of these layers:

1. **Presentation (React components)**
   - Pages and UI modules living under `src/` and `src/modules/`.
   - CSS Modules under `src/styles/`.

2. **State & Domain Logic**
   - Centralized YouTube/playlist state held in `src/store/store.tsx` via React Context.
   - Actions for playback, playlist manipulation, QR code modal visibility, and UI modes.

3. **Playback Integration**
   - `YouTubePlayer` component embeds and manages the YouTube IFrame Player.
   - `TrackInfo` integrates with the Media Session API for lock screen / hardware controls.

4. **Persistence & Platform Integration**
   - Playlist persistence via `localStorage` (browser).
   - Optional JSON export/import via the Sidebar.
   - `serviceworker.js` and `site.webmanifest` for PWA behavior.

Runtime environment:

- **Browser/PWA only**: `webpack-dev-server` for development and static assets from `dist/` (plus root `index.html`) in production.

---

## 3. Frontend Application Structure

Entry points:

- `src/index.tsx`
  - Bootstraps React using `createRoot`.
  - Wraps the app in `React.StrictMode`.
  - Registers `serviceworker.js` on `window.load`.
  - In development, overrides `console.log` to POST logs to `/log` (handled by `webpack.devserver.js`).

- `src/App.tsx`
  - Top-level application component.
  - Wraps the UI in `YouTubeProvider` (global store).
  - Manages the sidebar open/close state, including touch and mouse hover gestures.
  - Renders the core modules:
    - `Header` / `Footer` / `QRCodeModal`
    - `VideoForm` and `Controls`
    - `YouTubePlayer`
    - `TrackInfo`
    - `Sidebar` (contains the Playlist view and playlist actions).

UI modules (`src/modules/`):

- `videoform.tsx` – URL entry and video ID parsing.
- `control.tsx` – Playback, mode, repeat, favorite, and paste/clear controls.
- `youtubePlayer.tsx` – Embeds and manages the YouTube player.
- `playList.tsx` – Playlist and sub-playlist management UI.
- `sidebar.tsx` – Off-canvas sidebar that hosts the playlist and playlist-level actions.
- `trackInfo.tsx` – Displays current track information and hooks Media Session.
- `visualEffect.tsx` – Canvas-based spinning disk visualization using the current video thumbnail.
- `headerFooter.tsx` – Header (YouTube/Tracks toggle) and footer (QR code trigger, hints).
- `utilities.tsx` – Shared `Popup` component.

Styling:

- CSS Modules under `src/styles/` (e.g., `styles.module.css`, `playlist.module.css`, `sidebar.module.css`).
- Components import scoped CSS module files for layout and presentation.

---

## 4. State Management & Data Model

All core playback and playlist state is centralized in `src/store/store.tsx` via a React Context:

- `YouTubeState` includes:
  - `videoUrl`, `videoId`
  - `isPlaying`, `isVideoMode`, `repeat`
  - `isFavorite`, `isPastOrClear`
  - `playlist: PlaylistTrack[]`
  - `isQRCodeModalVisible`
  - `currentVideo` (`{ id, title } | null`)

- `YouTubeActions` expose setters and commands:
  - `setVideoUrl`, `setVideoId`, `setIsPlaying`, `setIsVideoMode`, `setIsFavorite`, `setRepeat`
  - `setIsPastOrClear`, `setIsQRCodeModalVisible`, `setCurrentVideo`
  - `setPlaylist`, `clearPlaylist`
  - Navigation: `playNextTrack`, `playPreviousTrack`

`PlaylistTrack` model:

```ts
export interface PlaylistTrack {
  id: string;        // YouTube video ID or 'subplaylist' marker
  title: string;     // Video title or sub-playlist name
  subPlaylist?: string; // Name of sub-playlist (optional)
}
```

Sub-playlists are implemented using:

- Regular tracks with `subPlaylist` pointing to the sub-playlist name.
- Marker items where `id === 'subplaylist'` used to record the existence/name of a sub-playlist.
- Consumers filter out `id === 'subplaylist'` when working with actual playable tracks.

Persistence:

- On mount, `YouTubeProvider` reads `localStorage['youtubePlaylist']` and initializes `state.playlist`.
- The playlist is saved back to `localStorage` on changes (after initial load).
- Fallbacks (try/catch) are used for storage read/write to avoid runtime failures.

---

## 5. Playback & Control Flow

### 5.1 URL to Playback

1. **User input**
   - User enters a YouTube URL in `VideoForm`.
   - `VideoForm` extracts the video ID using a regex targeting common YouTube URL formats.

2. **State update**
   - On submit, if a valid ID is found:
     - `setVideoId(id)` sets the current video in the store.
     - `setIsPlaying(true)` requests playback start.

3. **Player reaction**
   - `YouTubePlayer` listens to `videoId` and:
     - Loads the new video by ID via `loadVideoById`.
     - Starts playback if `isPlaying` is true.

### 5.2 Controls

The `Controls` component interacts heavily with the store:

- **Play/Pause**: Toggles `isPlaying`.
- **Audio/Video mode**:
  - Toggles `isVideoMode` (only when a valid `videoId` exists).
  - `YouTubePlayer` reacts by toggling the visibility of the `<div id="youtubePlayer">` and the canvas visualizer.
- **Repeat**:
  - Toggles `repeat` flag.
  - `YouTubePlayer` uses a `repeatRef` to replay the video when the player emits `ENDED`.
- **Favorite / Playlist add**:
  - Uses the YouTube Data API to fetch the video's title given its `videoId`.
  - Creates or updates a `PlaylistTrack` with `subPlaylist` assigned.
  - If multiple sub-playlists exist, a `Popup` allows the user to choose; otherwise, the track goes to `Main Playlist`.
- **Paste/Clear**:
  - Reads a URL from the clipboard (if supported) and sets `videoUrl`.
  - Toggles between "Paste" and "Clear" states via `isPastOrClear`.

### 5.3 Player Lifecycle & Background Behavior

`YouTubePlayer` is responsible for:

- Loading the YouTube IFrame API script.
- Creating the `YT.Player` instance targeting `#youtubePlayer`.
- Handling player events:
  - `PLAYING`: Ensures the player is unmuted, updates `currentVideo` based on `getVideoData`, saves current volume, and sets `isPlaying` to `true`.
  - `PAUSED`: Sets `isPlaying` to `false`.
  - `ENDED`: If `repeat` is enabled, immediately plays the video again.

Background and resilience mechanisms:

- On `document.visibilitychange`:
  - If the tab becomes hidden and playback was active, a short-lived interval periodically checks the player state.
  - If the video stops unexpectedly, it seeks to the current time and calls `playVideo()` again, re-applying volume and unmuting if needed.
- A periodic "health check" interval (every ~5 seconds) attempts to recover from an unstarted/error state by reloading the current video ID.

---

## 6. Playlist & Sidebar Behavior

### 6.1 Playlist UI (`playList.tsx`)

Responsibilities:

- Display tracks grouped by sub-playlist (`Main Playlist` plus user-defined sub-playlists).
- Allow selecting a track to play.
- Manage sub-playlists (create, rename semantics via move, delete).
- Support context menu actions via `Popup` for both tracks and sub-playlists.

Key behaviors:

- Grouping:
  - `groupedPlaylist` memoizes a map from `subPlaylist` name to an array of `PlaylistTrack`s.
  - The UI renders a main section and a collapsible section for each non-main sub-playlist.
- Track interaction:
  - Click: calls `selectTrack(id)` which sets `videoId` and then `isPlaying` (with a small delay).
  - Context menu: opens a track management popup allowing move between sub-playlists, reordering (up/down), or removal.
- Sub-playlist interaction:
  - A "+" button opens a popup to create a new sub-playlist; internally, a marker track with `id === 'subplaylist'` is added.
  - Context menu on a sub-playlist header opens a popup to:
    - Move all tracks in that sub-playlist back to `Main Playlist`.
    - Delete the sub-playlist and all its tracks.

### 6.2 Sidebar (`sidebar.tsx`)

The Sidebar wraps the `Playlist` UI and provides playlist-level actions:

- `Clear Playlist`:
  - Shows a confirm popup before calling `clearPlaylist()` from the store.
- `Export`:
  - Serializes the current playlist state to JSON and triggers a client-side download as `myplayer-playlist.json`.
- `Import`:
  - Reads a JSON file selected by the user, parses it, and if it contains an array, replaces the current playlist via `setPlaylist`.

The Sidebar also:

- Uses `isOpen` and `onClose` props to manage visibility (controlled by `App.tsx`).
- Stops click propagation to prevent closing when interacting inside the sidebar.

---

## 7. Media Session & Track Info

The `TrackInfo` component:

- Subscribes to `currentVideo` from the store.
- If supported, configures the `navigator.mediaSession`:
  - Sets `MediaMetadata` with the current video title, and fixed artist/album labels.
  - Registers action handlers:
    - `play` / `pause` -> `setIsPlaying`.
    - `previoustrack` / `nexttrack` -> `playPreviousTrack` / `playNextTrack`.
- Cleans up action handlers on unmount or when dependencies change.

This integration enables:

- Lock screen controls on supporting platforms.
- Hardware/media keys for play/pause/next/previous.

When no track is playing, `TrackInfo` renders a simple "No track playing" message.

---

## 8. Visual Effects

The `visualEffect.tsx` module provides a canvas-based spinning disk visualization:

- Listens to `videoId` and `isPlaying` from the store.
- Loads the YouTube thumbnail for the current video ID.
- Renders:
  - An outer ring.
  - The thumbnail clipped into a circular area.
  - An inner ring.
- Uses `requestAnimationFrame` to rotate the disk while `isPlaying` is true.

`YouTubePlayer` controls visibility:

- In video mode, the actual iframe is shown and the visualizer is hidden.
- In audio mode, the visualizer is shown and the iframe is hidden.

---

## 9. PWA & Offline Behavior

Service worker (`serviceworker.js`):

- Caches a fixed set of resources under `CACHE_NAME = 'my-player-cache-v1'`:
  - Core shell assets: `/dist/`, `/dist/index.html`, `/dist/main.js`.
  - Selected images in `/dist/resources/`.
  - External CSS from Font Awesome CDN.
  - The YouTube IFrame API script.
- `install` event:
  - Opens the cache and pre-caches the listed URLs.
- `fetch` event:
  - Serves cached responses when available; otherwise falls back to `fetch`.

Web manifest (`site.webmanifest`):

- Defines basic PWA metadata (name, icons, etc.) referenced by the generated `index.html`.

Limitations:

- Actual YouTube streaming and API requests are always online-only.
- Background playback is ultimately constrained by the browser/OS (especially on mobile platforms).

---

## 10. Build & Development Pipeline

Webpack configuration (`webpack.config.js`):

- Entry: `src/index.tsx`.
- Output:
  - Path: `dist/`.
  - Filename: `[name].js`.
  - `publicPath`:
    - Development: `/`.
    - Production: `dist/` (to match how assets are served in the Electron bundle / static hosting).
- Loaders:
  - `ts-loader` for `.ts`/`.tsx`.
  - `style-loader` + `css-loader` for CSS Modules.
- Plugins:
  - `HtmlWebpackPlugin`:
    - Uses `src/index.html` as a template.
    - In production, writes to `../index.html` so the built HTML sits at the project root.
  - `CopyWebpackPlugin`:
    - Copies `resources/` into `dist/resources`.
    - Copies `site.webmanifest` and `serviceworker.js` to the output root.
- Dev server (`webpack-dev-server`):
  - Serves from `dist/`, runs on port `9000`, with hot module replacement.
  - `setupMiddlewares` (from `webpack.devserver.js`) adds:
    - Request logging for all dev server routes.
    - A `/log` POST endpoint that prints client logs to the dev server console.

NPM scripts (`package.json`):

- `start`: development server (`webpack serve --mode development`).
- `build`: clean + production build (`dist/` + `index.html`).
-- `build-dev`: clean + development build.

---

## 11. Extension Points & Considerations

Potential extension areas:

- **Authentication & private playlists**:
  - Integrate with YouTube OAuth for user-specific playlists.
- **Richer metadata**:
  - Store additional fields (duration, channel, thumbnails) in `PlaylistTrack`.
- **Multi-device sync**:
  - Replace or augment `localStorage` with a backend API to sync playlists.
- **Theming / settings**:
  - Add user preferences (dark mode, keyboard shortcuts) to the global store.

Notes for contributors:

- Avoid editing files in `dist/` directly; it is a build output.
- The `electron/` directory contains legacy MSI installers from a prior Electron-based distribution flow and is no longer produced or used.
- Prefer extending the `YouTubeProvider` and React components instead of introducing ad-hoc global state.
