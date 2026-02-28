# Kaylios Component Manager — Full Summary

## Purpose
Kaylios Component Manager is a local component scaffolding workspace that lets 
you create, list, view, and delete UI component templates across React, Angular, 
Vue, and vanilla. It includes a REST API, a browser UI, and CLI tools to generate
component files in `components/<framework>/`.

## Core Behavior
- Creates component scaffolds with framework-specific templates and metadata (version, author, number).
- Stores component metadata and file contents in Postgres and writes files to disk.
- Lists components by framework; supports search with counts and line totals.
- Retrieves file lists, file content, and line counts per component and project.
- Deletes components from DB and disk.

## Server / API
- Express API at `/api` with endpoints:
  - `POST /api/components` create
  - `GET /api/components` list by framework
  - `GET /api/components/search` search with query/framework/limit
  - `GET /api/components/:framework/:component` list files
  - `GET /api/components/:framework/:component/content` get file contents
  - `GET /api/components/:framework/:component/line-count` per-component line counts
  - `GET /api/components/line-count-total` project totals
  - `DELETE /api/components/:framework/:component` delete
- Joi validation enforces valid frameworks and kebab-case component names.
- Requires `DATABASE_URL` (optional `DATABASE_SSL`) and uses Postgres via `pg`.
- Loads `.env` from `server/.env` if present; error responses return JSON.

## Browser UI
- Static `client/index.html` with a component tree and CodeMirror editor.
- Pulls list/totals from API; loads component files from `components/` (supports nested + legacy paths).
- Modal to create components via API; right sidebar shows metadata and line counts.
- Multiple editor themes; theme stored in localStorage.
- Optional bearer token via `window.KCM_API_TOKEN` or localStorage keys.

## CLI
- `scripts/add-component.mjs`: writes scaffold files directly to `components/`, supports `--force`.
- `cli/kcm.mjs`: API-backed CLI with commands for create/list/delete and an interactive mode.

## Build & Tests
- Build (repo root): `npm run build` -> generates `client/js/editor.js` (esbuild + babel).
- Server tests: `npm --prefix server test` (Jest + Supertest; currently covers `/api/health` + request validation).

## Why LOC Is High
- Minified bundles and source maps in `client/js` and `client/css` inflate line counts.
- Most “actual logic” lives in `server/src/services/components.service.js` and `client/js/editor-src.js`.


1. role
2. task
3. context
4. constraints
5. format