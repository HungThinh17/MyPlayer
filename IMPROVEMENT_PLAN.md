# Layout & Responsiveness Improvement Plan

## 1. Goals

- Remove the off‑canvas sidebar and move playlist management into the main content area.
- Establish a clear vertical layout: Header → Controls → Player/Track info → Playlist → Footer.
- Make the layout responsive and comfortable on phones, tablets, and desktops.
- Allow long playlists to scroll without breaking the background or footer.
- Reuse existing components (Playlist, Controls, TrackInfo, YouTubePlayer) instead of rewriting behavior.

---

## 2. Target Layout by Device

### 2.1 Phone (narrow screens, ~≤ 600px)

- Layout:
  - Full‑width header at the top.
  - Controls section (URL input + buttons) directly beneath header.
  - Player section: video or visualizer + current track info.
  - Playlist section stacked last, above the footer, and scrollable.
  - Footer fixed or sticky at the bottom (as currently implemented), always visible.
- Behavior:
  - Everything is stacked in a single column; no side‑by‑side layout.
  - Playlist list scrolls inside its own container so the header and controls don’t scroll off too quickly.
  - Avoid horizontal scroll; all sections should respect `max-width` and padding.

### 2.2 Tablet (medium screens, ~600–1024px)

- Layout:
  - Still primarily a vertical stack to keep things simple and readable.
  - Increase max widths for controls and player container to use more horizontal space.
  - Playlist section can be taller by default so more tracks are visible without scrolling the whole page.
- Behavior:
  - Optional enhancement: place Player and Playlist in a two‑row layout within the main area where the Player has slightly more vertical space than on phone.
  - Controls remain at the top of the main area for quick access.

### 2.3 Desktop (wide screens, >1024px)

- Layout:
  - Header and Footer span full width as now.
  - Main content uses a two‑column layout:
    - Left column: Controls + Player + TrackInfo (stacked).
    - Right column: Playlist header/actions + playlist list (scrollable).
  - The two columns share the same vertical height (viewport height minus header/footer).
- Behavior:
  - Playlist column can scroll independently while the left column remains mostly static.
  - Keep a reasonable max width for each column to avoid overly wide controls or text.

---

## 3. Component Structure Changes (Conceptual)

### 3.1 App Layout

- Simplify `App.tsx`:
  - Remove `Sidebar` import and all `isSidebarOpen` state, touch/mouse listeners, and handlers.
  - Stop passing `onToggleSidebar` into the `Header`; make the header independent of playlist visibility.
  - Introduce a main layout container and semantic sections:
    - `Header`
    - `<main className={styles.mainLayout}>`
      - Controls section
      - Player/TrackInfo section
      - Playlist section
    - `Footer`
    - `QRCodeModal`

### 3.2 Playlist Integration

- Replace the sidebar with an in‑page playlist module:
  - Create a small “Playlist Actions” area (Clear, Export, Import) above the playlist list.
  - Reuse the existing logic from `sidebar.tsx` for Clear/Export/Import; no functional changes.
  - Keep `Playlist` focused on rendering and managing tracks and sub‑playlists.

### 3.3 Header Behavior

- Remove the “Tracks” click behavior that toggled the sidebar.
- Keep the visual style (YouTube / Tracks title), but treat “Tracks” as non‑interactive or repurpose it if desired later (e.g., scroll to playlist).

---

## 4. CSS & Layout Constraints

### 4.1 App Container

- Update `.app` in `styles.module.css`:
  - Change from `height: 100vh` + `overflow: hidden` to:
    - `min-height: 100vh`
    - `overflow: auto`
  - Keep the background image and centering behavior.
  - Ensure the main layout is constrained with `max-width` and horizontal padding.

### 4.2 Main Layout & Sections

- Add a `mainLayout` container:
  - Mobile/tablet: `display: flex; flex-direction: column; gap: [small];`
  - Desktop: `display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: [medium];`
- Define section classes:
  - `controlsSection`: wraps `VideoForm` + `Controls`; full width on all devices, max width for readability.
  - `playerSection`: wraps `YouTubePlayer` + `TrackInfo`; uses existing `playerContainer` styles.
  - `playlistSection`: wraps playlist header/actions + `Playlist` list; scrollable area when content is long.
- Make the playlist section scroll independently on desktop via:
  - `max-height: calc(100vh - headerHeight - footerHeight - margins);`
  - `overflow-y: auto;`

### 4.3 Media Queries

- Introduce responsive breakpoints in `styles.module.css`:
  - `@media (max-width: 600px)` for phone:
    - Single column layout (default).
    - Tighten margins/padding where needed.
  - `@media (min-width: 600px) and (max-width: 1024px)` for tablets:
    - Slightly larger max widths for containers.
    - Adjust gaps between sections.
  - `@media (min-width: 1024px)` for desktops:
    - Activate the two‑column `mainLayout`.
    - Ensure playlist column is scrollable and visually distinct.

---

## 5. Migration Steps (Implementation Order)

1. **Remove Sidebar usage**  
   - Update `App.tsx` to remove `Sidebar` and all related state/handlers.  
   - Update `Header` usages to stop passing `onToggleSidebar`.

2. **Inline Playlist Actions + List**  
   - Extract Clear/Export/Import logic from `sidebar.tsx` into a reusable `PlaylistActions` helper or integrate directly in the new playlist section.  
   - Render `PlaylistActions` + `Playlist` within the main layout.

3. **Introduce Main Layout & Sections**  
   - Add `mainLayout`, `controlsSection`, `playerSection`, and `playlistSection` classes to `styles.module.css`.  
   - Wrap existing components in the new structure in `App.tsx`.

4. **Add Responsive CSS**  
   - Implement media queries and grid/flex rules for phone/tablet/desktop behavior as described above.  
   - Ensure the playlist section scrolls and does not push the footer off‑screen.

5. **Clean Up Legacy Styles**  
   - Remove unused sidebar‑specific styles (only after verifying nothing else depends on them).  
   - Optionally separate playlist/player styles out of `headerFooter.module.css` into their own files for clarity (non‑functional refactor).

6. **Manual Responsive Verification**  
   - Manually test in dev tools at common widths (375px, 768px, 1024px, 1440px).  
   - Verify: no horizontal scrollbars, playlist scroll behavior, header/footer visibility, and that controls remain easy to tap on touch devices.
