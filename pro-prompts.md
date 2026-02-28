# Pro Prompts (Kaylios Component Manager)

This repo works well with small, structured prompts. Use the templates below to get big, correct changes while keeping your input short.

## The 30-second template (copy/paste)

Task:
- <1 sentence describing what you want>

Constraints:
- Touch only: <paths/dirs> (or "anything needed")
- Do not change: <files/behavior you want preserved>
- Keep compatibility: Node <version>, browser targets, etc.

Acceptance criteria:
- <bullet list of observable outcomes>
- Tests/build: <commands that must pass>

Context:
- Relevant files: <repo-relative paths, optionally with line numbers>
- Notes: <edge cases, examples, expected API payloads, etc.>

Output preferences:
- Write large outputs to disk (do not paste huge files in chat).
- Keep responses concise; link me to paths for review.

## Repo commands (verified)

- Build editor bundle (repo root): `npm run build` -> generates `client/js/editor.js` (esbuild + babel).
- Run server (dev, nodemon): `npm --prefix server run server`
- Run server (prod): `npm --prefix server start`
- Run server tests: `npm --prefix server test` (Jest + Supertest).
- Scaffold component files to disk:
  - `npm run component:add -- --framework react --name alert-banner`
  - Add `--force` to overwrite existing files.
- API-backed CLI:
  - Interactive: `npm run cli`
  - Non-interactive: `npm run cli -- create -f react -n alert-banner --number CMP-101 --author Darrell`

## Prompt patterns

### Fix a bug (surgical)

Task: Fix <what is broken> in <area>.
Repro:
- Run: `<exact command>`
- Observed: `<paste error/output>`
Expected:
- <what should happen instead>
Constraints:
- Do not change: <anything you want preserved>
Acceptance:
- <tests/build commands> pass
- <specific behavior> verified

### Add/modify an API endpoint

Task: Add `METHOD /api/...` that <does X>.
Contract:
- Request: <JSON/body/query params>
- Response: <JSON shape + status codes>
Validation:
- Rules: <kebab-case, framework enum, required fields, etc.>
Acceptance:
- Add/update Supertest coverage in `server/test/...`
- Keep existing endpoints working

### Add/modify scaffolding templates

Task: Update scaffolding for `<framework>` components to generate:
- Files: <list>
- Content rules: <naming, imports, styles, etc.>
Constraints:
- Backwards compatibility: <yes/no>
Acceptance:
- `npm run component:add -- ...` generates correct output
- (Optional) update docs in `README.md` / `report.MD`

### Update the browser editor UI

Task: Change `client/` UI to <feature>.
UX details:
- Interaction: <what user clicks/types>
- Empty/loading/error states: <expectations>
Constraints:
- Keep `npm run build` working
Acceptance:
- Manual steps: <how to verify in browser>

### Docs/report update

Task: Update `<doc file>` to reflect <current behavior>.
Constraints:
- Keep it short and factual
- Prefer concrete commands and file paths
Acceptance:
- The doc matches `package.json` scripts and current code

## "Huge file" pattern (small input, big output)

When you want a large code/doc file, ask for it explicitly and tell me where to write it.

Example prompt:

"Create `docs/architecture.md` with sections: Overview, Data Flow, API, CLI, Editor, Storage. Use repo-relative paths and commands. Write the full file to disk (do not paste it in chat)."

