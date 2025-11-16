# MyPlayer

Small desktop/web player for YouTube that focuses on background playback, a simple interface, and local playlist management.

## Features
- Play YouTube videos in audio or video mode.  
- Persist playlist and current track information locally.  
- Attempt to keep playback running when the window or tab goes to the background.  
- Packaged as an Electron app with MSI installers.

## Getting Started
```bash
npm install
npm run start
```
This starts the webpack dev server and opens the React app at `http://localhost:9000`.

For a production build:
```bash
npm run build
```

To build Electron installers (Windows):
```bash
npm run dist
```

## PWA & Offline Behavior
- The app is installable as a PWA (manifest and service worker are configured for production builds).  
- The UI shell (HTML/JS/CSS) and your saved playlists/metadata are available offline once cached.  
- YouTube playback and video metadata fetching always require an active internet connection.  
- Background playback works only as far as the browser/OS allows (with stricter limits on iOS PWAs).  

## Contributing & Agent Instructions
- See `AGENTS.md` for contributor and agent guidelines (project structure, coding style, and workflow).  
- Do not edit files under `dist/` or `electron/` directly; they are build artifacts.  
