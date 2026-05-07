# Community Miscellaneous Management and Convenience Service Platform

This repository contains the full static prototype package for the community miscellaneous management and convenience service platform.

## Included in this repository

### Frontend prototypes

- `index.html`: property management console entry
- `resident.html`: resident app entry
- `console.js`
- `resident.js`
- `shared-state.js`
- `styles.css`
- `site.webmanifest`

### Static assets and mock data

- `assets/app-icon.svg`
- `mock/console-data.json`
- `mock/resident-data.json`
- `mock/shared-state.json`
- `tokens/resident-app.tokens.css`
- `tokens/resident-app.tokens.json`

### Product and design documents

This repository also includes the project PRD, research, design handoff, frontend review notes, and supporting Markdown documents prepared during the course project iteration.

## Run locally

Use any static server, for example:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/index.html
http://localhost:8000/resident.html
```

## Notes

- This is a static prototype package for presentation, design review, and frontend implementation handoff.
- Shared behavior is powered by mock JSON and `localStorage`.
- The latest resident-side version includes the continuous mobile app homepage rework and warm design token setup.
