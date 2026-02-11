# Kaylios Component Manager

Kaylios Component Manager is a local component scaffolding workspace with:

- A static browser UI for browsing/editing component files (`client/`)
- A REST API for creating/listing/reading/deleting component templates (`server/`)
- A project CLI command to scaffold component files directly (`npm run component:add`)

Generated component files are stored in `components/<framework>/`.

## Tech Stack

- Node.js
- Express 5 (`server/`)
- Joi validation
- CodeMirror 6 (`client/js/editor-src.js`)
- SCSS/CSS frontend styles

## Project Layout

- `client/` frontend UI and editor bundle sources
- `server/` API server and tests
- `scripts/add-component.mjs` CLI generator
- `components/` generated output directory
- `cli/` reserved directory (currently empty)

## Prerequisites

- Node.js 18+
- npm

## Install

Install root dependencies:

```bash
npm install
```

Install server dependencies:

```bash
cd server
npm install
```

## Run The API

From `server/`:

```bash
npm run dev
```

Server default port is `4173` (override with `PORT`).

Health check:

```bash
curl http://localhost:4173/api/health
```

## API Endpoints

Base path: `/api/components`

1. `POST /api/components` create a component scaffold
2. `GET /api/components` list components grouped by framework
3. `GET /api/components/:framework/:component` list files for one component
4. `DELETE /api/components/:framework/:component` delete all files for one component

Example create request:

```bash
curl -X POST http://localhost:4173/api/components \
  -H "Content-Type: application/json" \
  -d '{
    "framework": "react",
    "component": "alert-banner",
    "version": "1.0.0",
    "author": "Darrell",
    "number": "CMP-101"
  }'
```

Valid frameworks: `react`, `angular`, `vue`, `vanilla`.

Component names must be kebab-case (example: `alert-banner`).


### Behavior

- Creates files in `components/<framework>/`
- `angular` generates:
  - `<name>.component.ts`
  - `<name>.component.html`
  - `<name>.component.scss`
  - `<name>.component.spec.ts`
- `react`, `vue`, `vanilla` generate:
  - `<name>.html`
  - `<name>.js`
  - `<name>.scss`
- Existing files fail by default; use `--force` to overwrite.
- Prints a sidebar HTML snippet for inserting into the frontend component tree.

## Frontend Editor

The UI is in `client/index.html` and expects component files under `components/`.

To rebuild the editor bundles from source:

```bash
npm run build
```

Build scripts:

- `npm run build:bundle` bundles/minifies `client/js/editor-src.js` with esbuild
- `npm run build:transpile` transpiles `client/js/editor.es2017.js` with Babel

## Tests

From `server/`:

```bash
npm test
```

Current tests cover health and request validation paths (`server/test/components.api.test.js`).
