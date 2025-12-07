# Improvement Plan (Post v2 Minimalist Review)

This plan reflects the latest expert feedback in `FEEDBACK.md` for the current "version 2" dark UI.

---

## 1. Current Status (v2)

- Done: Layout is structured (Header -> Controls -> Player/Track -> Playlist -> Footer).
- Done: Dark theme is more intentional than the original textured background.
- Done: Controls and playlist live in the main view (no sidebar).
- Not yet: True minimalism.
  - Shadows and rounded blocks are still visually heavy in places.
  - Color palette mixes logo colors, bright green, white, and grays.
  - Playlist still feels like a "data dump" rather than a curated listening UI.
  - Typography hierarchy is weak (no clear H1/H2/Body system).
  - Footer and contact info feel dense.

---

## 2. High-Level Goals

1. Reduce visual noise and cognitive load.
2. Establish a disciplined color system with one primary accent.
3. Simplify controls and emphasize only essential actions.
4. Make the playlist feel like a modern music app list, not a raw table.
5. Introduce a clear typography scale (H1 / H2 / Body / Muted).
6. Prepare the design so a light theme can be added later without structural changes.

---

## 3. Visual Language and Color Palette

### 3.1 Container Styling

- Remove or greatly reduce any remaining heavy shadows on:
  - URL form container.
  - Player container.
  - Track info container.
  - Playlist panel.
- Prefer:
  - Subtle 1px borders (for example `rgba(255, 255, 255, 0.06)` to `0.12`) instead of strong drop shadows.
  - Smaller, consistent border radius (about 4 to 8 px) instead of big pills or thick blocks.

### 3.2 Color System

- Define a small token-based palette in CSS:
  - `--bg-main`, `--bg-elevated`, `--fg-primary`, `--fg-muted`, `--border-subtle`, `--accent`.
- Pick one accent color and avoid neon saturation:
  - For example calm blue `#3C82F6` or a softer green variant.
- Use the accent only for:
  - Primary controls (Play, submit, important links like "Show QR Code").
  - Focus and active states.
  - Selected playlist item border or subtle background.

---

## 4. Header and Branding

- Replace the current playful "YouTube / Tracks" header styling with a cleaner, minimal wordmark:
  - Single color (white or the accent).
  - Simple font (no handwritten or script style).
- Keep the header compact so it feels like part of the UI, not a large logo banner.
- Optionally:
  - Keep the original fun styling for a "brand mode".
  - Use a flat, monochrome variant for the minimalist mode.

Files to adjust:
- `src/components/layout/headerFooter.tsx`
- `src/styles/headerFooter.module.css`

---

## 5. URL Input and Submit Button

### 5.1 Input Field

- Flatten the URL input further:
  - Remove any remaining shadow.
  - Use either:
    - A thin outline on a transparent background, or
    - A flat, slightly lighter background with no depth.
- Use a smaller radius (about 4 to 6 px) on the input container instead of a full pill.

### 5.2 Submit Button

- Match the submit button visually with the input:
  - Same height and vertical alignment.
  - Same border radius system.
  - Accent color, but not overly bright.
- Consider search-bar style:
  - Icon embedded at the right side of the input instead of a separate stand-alone button.

Files to adjust:
- `src/styles/styles.module.css` (especially `.formContainer`, `.videoForm`, `.youtubeUrl`, `.submitButton`)

---

## 6. Player Controls

### 6.1 Visible Controls

- Decide which controls must be always visible:
  - Primary: Play / Pause, Audio / Video mode toggle.
  - Secondary: Repeat, Favorite, Paste/Clear.
- For secondary actions:
  - Group them more tightly, or
  - Move some into a "more" menu or a compact layout on small screens.

### 6.2 Visual Treatment

- Keep all controls icon-only:
  - No permanent filled backgrounds except the primary Play / Pause.
  - Subtle hover and active styles using background and scale changes.
- Use a single icon set with consistent size and weight.

Files to adjust:
- `src/features/player/control.tsx`
- `src/styles/styles.module.css` (`.controls`, `.iconButton`, `.playPauseButton`)

---

## 7. Now Playing (Thumbnail and Title)

- Reduce visual weight around the "now playing" title:
  - Minimize or remove any heavy background block directly behind text.
  - Use more spacing above and below the title to let it breathe.
- Typography:
  - Title: about 18 to 20 px, bold, left-aligned.
  - Optional subtitle (for example channel or extra info): about 14 px, muted (70 percent opacity).

Files to adjust:
- `src/features/player/trackInfo.tsx`
- `src/styles/trackInfo.module.css`

---

## 8. Playlist Panel and Items

### 8.1 Toolbar (Clear / Export / Import)

- Make the toolbar feel like a minimal, text-first strip:
  - Outline or plain text buttons (for example "Clear playlist") without thick pills.
  - All actions on one row, right-aligned, with consistent small spacing.

### 8.2 Rows and Highlight

- Playlist row design:
  - Height around 40 to 44 px.
  - Left-aligned title, truncated with ellipsis.
  - Subtle divider line with low contrast.
  - Hover: slight background darkening.
- Active item:
  - Use a soft accent border or subtle background shift.
  - Avoid bright or neon fills.

### 8.3 Sub-playlists

- Sub-playlist headers should clearly look like section headers:
  - Slightly larger font and semi-bold weight.
  - Clear expand and collapse affordance (icon and hit area).

Files to adjust:
- `src/features/playlist/playList.tsx`
- `src/styles/playlist.module.css`
- `src/styles/styles.module.css` (playlist toolbar)

---

## 9. Footer and Contact

- Simplify footer content:
  - One primary line, for example: "HungTi - Show QR Code".
  - Move extra notes into:
    - A tooltip,
    - An "About" modal,
    - Or a small "More info" link.
- Make footer text visually lighter:
  - Smaller font size.
  - Muted text color using the `--fg-muted` tone.

Files to adjust:
- `src/components/layout/headerFooter.tsx`
- `src/styles/headerFooter.module.css`

---

## 10. Future: Dark and Light Themes

### 10.1 Theme System

- Introduce theme tokens (CSS variables) covering:
  - Backgrounds, text, borders, accents, hover states.
- Implement:
  - `data-theme="dark"` and `data-theme="light"` on the root element.
  - Two sets of variables in a single CSS file.

### 10.2 Theme Switch

- Add a small sun / moon toggle in the header:
  - Always visible.
  - Store the preference in `localStorage`.

Scope: later. First focus on a strong dark minimal baseline.

---

## 11. Implementation Order

1. Color system and containers  
   - Define palette tokens and remove remaining heavy shadows and inconsistent radii.
2. Header and input / controls  
   - Simplify branding, URL bar, and controls to match the palette and minimal style.
3. Playlist UX  
   - Redesign playlist toolbar and rows following the minimalist list pattern.
4. Now Playing and Footer  
   - Clarify title hierarchy and trim footer content.
5. Theme-ready refactor  
   - Introduce CSS variables and a basic theme switch (without fully designing light mode yet).

