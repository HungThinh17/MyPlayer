# MyPlayer – UI Improvement Checklist (Central Player View)

This checklist focuses on making the **central player view** cleaner, more professional, and visually focused, based on the feedback in `Feeback.md`.

> Legend:  
> - [ ] Planned  
> - [x] Done / implemented

---

## 1. Background & Layout Framing

- [ ] Replace the current detailed background image with a minimalist base:
  - [ ] Use a solid light gray (e.g. `#F5F5F5`) or white background for the app root (`.app` in `styles.module.css`).
  - [ ] Optionally define a dark-mode variant using a dark gray (e.g. `#1E1E1E`) behind the player container (not mandatory yet, but keep in mind for future).
- [ ] Introduce a **player container card** that groups the main UI:
  - [ ] Wrap the input field, controls, and visualizer/player area in a single container (e.g. `.playerCard`).
  - [ ] Give the container a solid background (white or very light gray) with:
    - [ ] Slight border-radius (6–10px).
    - [ ] Subtle box-shadow or border to clearly separate it from the page background.
  - [ ] Ensure the container is centered horizontally and vertically biased towards the top (not touching the edges on small screens).

Files to touch:  
- `src/styles/styles.module.css` (new `.playerCard`, adjust `.app` background)  
- `src/app/App.tsx` (wrap `VideoForm`, `Controls`, `YouTubePlayer`, `TrackInfo` in the new container)

---

## 2. Input / Search Bar Redesign

- [ ] Improve input field readability and hierarchy:
  - [ ] Increase font-size of the placeholder and content (e.g. 16–18px) in `.youtubeUrl`.
  - [ ] Ensure sufficient padding (top/bottom) so the field doesn’t feel cramped.
  - [ ] Use consistent border-radius (3–5px) on the entire input+button group.
- [ ] Replace the current arrow icon with a more intuitive action icon:
  - [ ] Decide on the primary behavior:
    - [ ] If the field primarily **plays the given URL**, use a solid **play icon** (e.g. FontAwesome `fa-play` in a filled button).
    - [ ] If you intend to support searching in future, consider a **magnifying glass** (`fa-search`), but keep it consistent with behavior.
  - [ ] Update the button styling to emphasize the action:
    - [ ] Use a primary color background (e.g. blue/teal) with white icon.
    - [ ] On hover/focus, apply subtle brightness or shadow changes.
- [ ] Align the input visually with the player container:
  - [ ] Ensure the input and button together fill most of the container width but leave reasonable side margins.

Files to touch:  
- `src/features/player/videoform.tsx`  
- `src/styles/styles.module.css` (classes `.videoForm`, `.youtubeUrl`, `.submitButton`)

---

## 3. Player Controls Layout & Styling

- [ ] Position controls as a dedicated row under the input:
  - [ ] Ensure controls appear **directly below the input** and are centered within the player container.
  - [ ] Maintain consistent vertical spacing between input, controls, and the visualizer/player.
- [ ] Improve control prominence and consistency:
  - [ ] Increase icon sizes (e.g. use FontAwesome `fa-2x` or adjust font-size in CSS).
  - [ ] Standardize button shapes and spacing:
    - [ ] All control buttons share the same size, padding, and border-radius.
    - [ ] Use consistent gaps between buttons.
  - [ ] Make the primary action (Play/Pause) visually dominant:
    - [ ] Apply a primary color background + white icon.
    - [ ] Secondary actions (mode toggle, repeat, favorite, paste/clear) use lighter styles (outlined or subtle backgrounds).
- [ ] Ensure controls look good on mobile:
  - [ ] Confirm buttons are large enough for touch (min ~40x40 px).
  - [ ] Reduce side padding or switch to wrapping layout on very narrow widths if necessary.

Files to touch:  
- `src/features/player/control.tsx`  
- `src/styles/styles.module.css` (controls-related classes)

---

## 4. Player / Visualizer Area

- [ ] Integrate the YouTube player/visualizer into the card:
  - [ ] Ensure the iframe (`#youtubePlayer`) and the spinning disk visualizer live within the same player container.
  - [ ] Apply consistent padding around this area so it doesn’t touch container edges.
- [ ] Harmonize background and borders here:
  - [ ] Ensure the visualizer background doesn’t clash with the main app background.
  - [ ] If needed, give the visualizer a subtle border or rounded corners matching the card.

Files to touch:  
- `src/features/player/youtubePlayer.tsx`  
- `src/styles/player.module.css`

---

## 5. Track Info Visibility

- [ ] Make the current track info a clear, dedicated element:
  - [ ] Keep `TrackInfo` visually attached to the player container (inside it, near the bottom).
  - [ ] When no track is playing, display a clear message like “No track playing” with adequate contrast.
  - [ ] When a track is playing, emphasize the title using slightly larger or bolder text.
- [ ] Ensure text contrast and readability:
  - [ ] Use dark text on light card backgrounds (or invert if you go with a dark theme).
  - [ ] Avoid overlaying text directly on any high-contrast imagery.

Files to touch:  
- `src/features/player/trackInfo.tsx`  
- `src/styles/trackInfo.module.css`

---

## 6. Branding (Header) & Footer

- [ ] Simplify and unify the header branding:
  - [ ] Ensure the header typography uses a clean, legible font and a controlled color palette (1–2 main colors).
  - [ ] Avoid heavy effects (extreme shadows/rotations) that compete with the player.
  - [ ] Consider aligning header branding visually with the player container (e.g. same horizontal width or centered alignment).
- [ ] Refine footer for clarity and hierarchy:
  - [ ] Keep contact info and notes **outside** the main player container.
  - [ ] Use smaller font-size and neutral colors with good contrast (e.g. dark gray text on light gray background).
  - [ ] Ensure the footer doesn’t visually overpower the player (reduced padding, subtle styling).

Files to touch:  
- `src/components/layout/headerFooter.tsx`  
- `src/styles/headerFooter.module.css`

---

## 7. Theming & Design Tokens (Optional but Recommended)

- [ ] Introduce basic design tokens via CSS variables or a small theme module:
  - [ ] Primary color (e.g. `--color-primary`).
  - [ ] Background color(s) (`--color-bg`, `--color-card-bg`).
  - [ ] Text colors (`--color-text`, `--color-muted`).
- [ ] Use those tokens consistently across:
  - [ ] Input, buttons, and controls.
  - [ ] Player container background and borders.
  - [ ] Header and footer text.

Files to touch:  
- `src/styles/styles.module.css` (root variables)  
- Possibly other CSS modules to consume the variables

---

## 8. Micro-Interactions & Polish (After Layout is Stable)

- [ ] Add subtle hover/focus states:
  - [ ] Input field: border or shadow change on focus.
  - [ ] Buttons: background/opacity/transform changes on hover/focus.
- [ ] Ensure transitions are smooth but not distracting:
  - [ ] Use short transitions (150–250ms) on color/box-shadow changes.
- [ ] Verify that the layout still looks good with long video titles and on smaller screens.

Files to touch:  
- Relevant CSS modules (`styles.module.css`, `player.module.css`, `playlist.module.css`, etc.)

