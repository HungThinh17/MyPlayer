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

## Contributing & Agent Instructions
- See `AGENTS.md` for contributor and agent guidelines (project structure, coding style, and workflow).  
- Do not edit files under `dist/` or `electron/` directly; they are build artifacts.  

