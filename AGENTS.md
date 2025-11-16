# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React + TypeScript source code.  
  - `src/components/`: Generic, reusable UI components.  
  - `src/modules/`: Feature modules (player, sidebar, header/footer, playlist, etc.).  
  - `src/store/`: Global player state and context.  
  - `src/styles/`: CSS modules and shared styles.  
- `resources/`: Icons and static assets for the web and Electron builds.  
- `dist/`: Bundled output (generated; do not edit manually).  
- `electron/`: Built installers (`.msi`); treated as artifacts only.  

## Build, Test, and Development Commands
- `npm run start` – Start the webpack dev server at `http://localhost:9000`.  
- `npm run build-dev` – Development bundle into `dist/`.  
- `npm run build` – Production bundle into `dist/`.  
- `npm run clean` – Remove `dist/`.  
- `npm run pack` – Build unpacked Electron app.  
- `npm run dist` – Build Electron installers.  
- `npm test` – Currently a placeholder; update when tests are added.  

## Coding Style & Naming Conventions
- Language: TypeScript + React functional components.  
- Indentation: 2 spaces; avoid trailing whitespace.  
- Strings: single quotes; always use semicolons.  
- Components, types, and interfaces: `PascalCase`.  
- Variables, hooks, and functions: `camelCase`.  
- Prefer CSS modules imported as `styles` and colocated with features when reasonable.  

## Testing Guidelines
- No formal tests exist yet; add Jest/React Testing Library tests for new non‑trivial logic.  
- Place tests alongside modules under `src/**/__tests__` or a similar mirrored structure.  
- Update `npm test` to run the test suite and keep it passing before merging.  

## Commit & Pull Request Guidelines
- Commits: concise, descriptive messages in English (e.g., `Fix autoplay in background`, `Add sidebar playlist filter`).  
- Reference issues in the body when applicable (`Fixes #12`).  
- Pull requests should include:  
  - A short description of the change and rationale.  
  - Screenshots/GIFs for UI changes.  
  - Notes on how to reproduce and what was tested.  

## Agent-Specific Instructions
- Do not edit `dist/` or `electron/` binaries; change source under `src/` and rely on build scripts.  
- Follow existing patterns in nearby files for state access (`useYouTubeStore`) and styling.  
- Prefer minimal, targeted changes; avoid large refactors unless explicitly requested.  
- When adding dependencies or build steps, update `README.md` and any relevant scripts.  

