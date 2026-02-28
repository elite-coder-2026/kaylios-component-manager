# AGENTS.md (Kaylios Component Manager)

Scope: This file applies to everything under this directory unless overridden by a deeper AGENTS.md.

## Quick Commands
- Install (root): `npm install`
- Install (server): `npm --prefix server install`
- Build editor bundle: `npm run build`
- Run API (dev): `npm --prefix server run server`
- Run API (prod): `npm --prefix server start`
- Test (server): `npm --prefix server test`

## Repo Conventions
- Root is ESM (`"type": "module"` in `package.json`): keep root scripts/CLI as ESM.
- `server/` is CommonJS: use `require`/`module.exports` in `server/src/**` and `server/test/**`.
- Prefer double quotes and semicolons; keep diffs minimal and consistent with nearby code.

## Generated / Don't Hand-Edit
- Don't manually edit built artifacts:
  - `client/js/editor.es2017.js`
  - `client/js/editor.js`
  Update `client/js/editor-src.js`, then run `npm run build`.
- Avoid editing `*-min.js` under `server/src/**` if there is a non-min source file; change the source instead.

## Testing Expectations
- For server/API changes: add/update Supertest coverage in `server/test/**`.
- Keep tests focused (one behavior per test where possible).

## Safety / Workflow
- Don't run destructive git commands (reset/clean) unless explicitly asked.
- If a change impacts API shape or CLI flags, call it out and confirm expected behavior.
- Prefer writing large outputs to disk (files) instead of pasting huge blobs into chat.

