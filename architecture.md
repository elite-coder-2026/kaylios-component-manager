# Kaylios Component Manager — Architecture Task List

This file is a *functional scope checklist* of what the app does today (frontend + backend + CLIs). Use it as a “what exists / what to verify” task list.

## Backend (API server)

- [ ] Start Express app and mount `/api` routes (`server/src/server.js`, `server/src/app.js`)
- [ ] Load `.env` for server process (`server/src/config/load-env.js`)
- [ ] Connect to Postgres and fail fast if unavailable (`server/src/db/client.js`)
- [ ] Enable CORS, JSON body parsing, and URL-encoded parsing (`server/src/app.js`)
- [ ] Standard JSON error responses `{ ok: false, error, stack? }` (`server/src/middleware/error-handler.js`)
- [ ] `GET /api/health` returns service ok payload (`server/src/routes/index.js`)

### Components API (`/api/components`)

- [ ] Validate request bodies/params/query via Joi (`server/src/validation/components.validation.js`)
- [ ] `POST /api/components` creates component scaffold (DB + filesystem) (`server/src/controllers/components.controller.js`, `server/src/services/components.service.js`)
  - [ ] Enforce allowed frameworks: `react|vue|vanilla`
  - [ ] Enforce kebab-case component names
  - [ ] Generate template files per framework:
    - [ ] React: `*.jsx|scss`
    - [ ] Vue/Vanilla: `*.html|js|scss`
  - [ ] Prevent overwriting existing files (409 conflict)
  - [ ] Transactionally insert `components` + `component_files` rows and write files to `components/<framework>/<component>/`
  - [ ] Roll back written files on failure
- [ ] `GET /api/components` lists components grouped by framework (DB-backed)
- [ ] `GET /api/components/:framework/:component` lists filenames for a component (DB-backed)
- [ ] `GET /api/components/:framework/:component/content` returns filenames + file content (DB-backed)
- [ ] `GET /api/components/search?q=...&framework=...&limit=...` searches by component name (DB-backed; returns aggregated line totals from DB content)
- [ ] `GET /api/components/:framework/:component/line-count` returns per-file + total line counts (filesystem-backed; supports nested + legacy layouts)
- [ ] `GET /api/components/line-count-total` returns totals across the whole `components/` tree (filesystem-backed)
- [ ] `DELETE /api/components/:framework/:component` deletes component (DB-backed; attempts filesystem cleanup)

### Auth (present, not enforced by default)

- [ ] Verify HS256 JWT bearer token and populate `req.user` (`server/src/middleware/auth.js`)
- [ ] Enforce role-based access (`requireRole(...)`) (`server/src/middleware/auth.js`)
- [ ] (Optional wiring) Apply auth middleware to component routes (`server/src/routes/components.routes.js`)

## Frontend (static UI in `client/`)

- [ ] Render shell layout: framework sidebar, editor, preview iframe, right-sidebar info (`client/index.html`)
- [ ] Fetch component list from API and populate framework trees (`client/js/editor-src.js`)
- [ ] Create component tree nodes + file links per framework (`client/js/editor-src.js`)
- [ ] Add component modal:
  - [ ] Open/close modal and handle Escape/backdrop/cancel (`client/index.html`, `client/js/editor-src.js`)
  - [ ] Normalize name to kebab-case and submit `POST /api/components` (`client/js/editor-src.js`)
  - [ ] Optimistically track freshly generated components client-side for fast reads (`generatedComponents` map)
- [ ] Select component file in sidebar:
  - [ ] Load content from API (`GET /api/components/:framework/:component/content`) and pick best file candidates by framework/role
  - [ ] Fallback to direct fetch from `components/` on disk if API fails (nested + legacy path candidates)
  - [ ] Extract metadata (version/author/number) from header comments when present
- [ ] Show component info panel:
  - [ ] Project totals from `GET /api/components/line-count-total`
  - [ ] Per-component line counts from `GET /api/components/:framework/:component/line-count`
  - [ ] “Delete component” action with confirmation (`DELETE /api/components/:framework/:component`)
- [ ] Code editor:
  - [ ] CodeMirror 6 editor with line numbers, history, and wrapping (`client/js/editor-src.js`)
  - [ ] Maintain in-memory content for `html|javascript|scss` (no persistence back to DB/filesystem)
- [ ] Preview iframe:
  - [ ] Refresh on demand and debounce refresh while typing (`client/js/editor-src.js`)
  - [ ] React preview using UMD React/ReactDOM + Babel from CDN (requires network access from the browser)
  - [ ] Vanilla/Vue preview as plain HTML + styles (no Vue runtime execution)
- [ ] Editor theme picker:
  - [ ] Multiple themes and syntax highlighting palettes
  - [ ] Persist theme choice to `localStorage` (`kcm_editor_theme`)

### Frontend auth header behavior

- [ ] Attach `Authorization: Bearer <token>` to API calls when token is present
  - [ ] Read from `window.KCM_API_TOKEN` or storage keys `kcm_token|authToken|token`

## CLI tools

### API-backed CLI (`kcm`)

- [ ] Create component via API (`kcm create ...`) (`cli/kcm.mjs`)
- [ ] List components via API (`kcm list`) (`cli/kcm.mjs`)
- [ ] Delete component via API (`kcm delete ...`) (`cli/kcm.mjs`)
- [ ] Interactive mode for create/list/delete (`kcm` with no args or `kcm interactive`) (`cli/kcm.mjs`)
- [ ] Configure API base via `KCM_API_URL` or `--api <url>` (`cli/kcm.mjs`)

### Direct scaffolder (filesystem only)

- [ ] Generate files under `components/<framework>/<component>/` (`npm run component:add -- ...`) (`scripts/add-component.mjs`)
- [ ] Support `--force` overwrite behavior (`scripts/add-component.mjs`)
- [ ] Print a sidebar HTML snippet for manual insertion (informational output) (`scripts/add-component.mjs`)

## Storage & data model

- [ ] Filesystem is authoritative for line-count endpoints and UI fallback reads (`components/`)
- [ ] Postgres is authoritative for list/content/search endpoints (`server/src/services/components.service.js`)
- [ ] Expected tables (inferred from queries):
  - [ ] `components(framework, component, version, author_name, component_number, ...)`
  - [ ] `component_files(component_id, filename, content, ...)`
- [ ] (Gap to track) No migrations/schema definitions in repo; DB schema must exist externally

## Build & tests

- [ ] Build editor bundle with esbuild + Babel (`npm run build`) (`package.json`, `client/js/editor-src.js`)
- [ ] Run API in dev/prod (`npm --prefix server run server|start`) (`server/package.json`)
- [ ] Server tests with Jest + Supertest (basic health + validation) (`server/test/components.api.test.js`)

## Key files (quick navigation)

- [ ] API entry: `server/src/server.js`
- [ ] API app wiring: `server/src/app.js`
- [ ] API routes: `server/src/routes/index.js`, `server/src/routes/components.routes.js`
- [ ] API controller/service: `server/src/controllers/components.controller.js`, `server/src/services/components.service.js`
- [ ] API validation: `server/src/validation/components.validation.js`
- [ ] Client page/bundle source: `client/index.html`, `client/js/editor-src.js`
- [ ] CLI tools: `cli/kcm.mjs`, `scripts/add-component.mjs`
