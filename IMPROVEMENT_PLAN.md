# Improvement Plan (Layout + Minimalist UI)

This plan tracks what has been done and what is still planned, combining the layout work with the minimalist UX feedback from `FEEDBACK.md`.

---

## 1. Status Overview

- ✅ Replaced sidebar with in-page playlist panel.
- ✅ Introduced new main layout (Header → Controls → Player/Track Info → Playlist → Footer).
- ✅ Added responsive behavior for phone/tablet/desktop with a two-column layout on desktop.
- ✅ Ensured long playlists scroll inside their own area.
- ✅ Wired Clear / Export / Import playlist actions into the new panel.
- ⏳ Not yet addressed: minimalist visual language, typography system, and control/playlist visual simplification.

---

## 2. Layout & Responsiveness (Implemented)

### 2.1 Goals

- Remove the off-canvas sidebar and move playlist management into the main content area.
- Establish a clear vertical layout with logical sections.
- Make the layout responsive and comfortable on phones, tablets, and desktops.
- Allow long playlists to scroll without breaking the background or footer.

### 2.2 Behavior by Device

- **Phone (~≤ 600px)**
  - Single-column layout: Header → Controls → Player/Track Info → Playlist → Footer.
  - Playlist appears as a card below the player and scrolls inside its own area.
  - No horizontal scrolling.

- **Tablet (~600–1024px)**
  - Still primarily single-column, but with wider max-widths for controls and player.
  - Playlist card taller so more items are visible.

- **Desktop (>1024px)**
  - Two-column main layout:
    - Left: Controls + Player + TrackInfo (stacked).
    - Right: Playlist panel (toolbar + scrollable list).
  - Playlist column scrolls independently; footer and background remain stable.

---

## 3. Minimalist UI Improvements (Planned)

Based on the expert feedback in `FEEDBACK.md`, the next steps focus on simplifying and unifying the visual language.

### 3.1 Overall Visual Language

- Replace the noisy background image with either:
  - A flat solid background, or
  - A very subtle gradient that doesn’t compete with content.
- Reduce or remove heavy shadows and thick borders across the app.
- Introduce a small spacing scale (e.g. 8px / 12px / 16px) and reuse it consistently.
- Choose one primary accent color and apply it consistently for primary actions.

### 3.2 YouTube URL Input Bar

- Simplify the `formContainer` styling:
  - Lighter or no drop-shadow, more subtle border-radius.
  - Background opacity toned down so it feels lighter.
- Update the URL input and submit button to feel like a modern search bar:
  - Thinner borders or underline-style.
  - Action icon visually integrated at the right side.
  - Consistent icon style (matching player controls).

### 3.3 Player Controls

- Move towards icon-only controls with clear hover and active states.
- Emphasize the primary action (Play/Pause):
  - Slightly larger size or stronger accent color.
- Consider hiding less-used actions behind a “more” menu or grouping them more tightly.
- Switch to a single, consistent icon set and align sizes and stroke weights.

### 3.4 Now Playing (Thumbnail + Title)

- Remove any decorative frame around the thumbnail; keep it flat and clean.
- Add a clear text hierarchy for the current track:
  - Title: larger, bold.
  - Secondary text (if added later): smaller, muted color.
- Increase vertical spacing around the title to give it breathing room.

### 3.5 Playlist Panel

- Lighten the playlist panel visuals to better match a minimalist style:
  - Turn Clear/Export/Import into simple text or outline buttons in a thin toolbar.
  - Reduce button padding and visual weight.
- Simplify playlist rows:
  - Single-line row height with consistent vertical spacing.
  - Only show the title; further metadata (if needed) can come later.
  - Use subtle separators or hover background for scanning.

### 3.6 Footer and QR Code

- Keep the footer as a single-line or very compact text area.
- Reduce font size and possibly use slightly muted color (e.g. 70% opacity).
- Keep the QR code behind the existing modal, but ensure the trigger is a subtle text link or icon that fits the minimalist style.

---

## 4. Typography System (Planned)

- Adopt a small, consistent type scale:
  - `H1` (app title / major headings): ~20–22px, bold.
  - `H2` (section titles like “Playlist”): ~16–18px, semi-bold.
  - `Body` (general text, labels): ~14–16px, regular.
  - `Muted` text: same size as Body, but ~70–75% opacity.
- Apply this consistently to:
  - Header title.
  - Section titles (e.g. Playlist heading, “Now Playing” if added).
  - Playlist rows, footer text, helper text.

---

## 5. Implementation Order for Upcoming Work

1. **Visual Clean-Up (Background + Shadows)**
   - Simplify `.app` background and reduce heavy shadows and radii across main containers.

2. **Controls + Input Minimalism**
   - Restyle the URL input bar and player controls to match a minimalist, icon-first design.

3. **Playlist Panel Simplification**
   - Lighten playlist toolbar buttons and row styling; improve scan-ability.

4. **Typography Pass**
   - Implement the typography scale and apply it to headers, body text, playlist items, and footer.

5. **Polish and Micro-UX**
   - Review hover/focus/active states, spacing, and section separation to ensure the app feels clean and intentional on all screen sizes.

