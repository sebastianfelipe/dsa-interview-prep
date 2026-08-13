# DSA Studio AI

**Master DSA. Crack Interviews.**

Study UI for this repo: browse topics by difficulty, read pattern-first writeups, and compare solution approaches.

## Quick start

```bash
yarn
yarn dev
```

- UI: http://localhost:5173
- API: http://localhost:3001/api/catalog
- Swagger: http://localhost:3001/api/swagger

## Repo layout

```text
api/           NestJS backend (Swagger at /api/swagger)
ui/            Vite React study app
topics/        Numbered curriculum (00–16)
resources/     patterns, cheat-sheets, study-plans, templates
lists/         Easy/Medium prep-list definitions
lib/           Shared TS helpers for solutions/tests
```

## Problem layout

```text
topics/NN-topic/problems/<slug>/
  meta.json
  README.md          # description only
  solution.ts
  cases.json         # structured I/O: examples + edgeCases
  solution.test.ts   # thin Vitest bridge over cases.json
```

## Run / Submit (I/O judge)

On a problem page, the selected chip’s TypeScript loads into an editable console:

| Action | Suite | API |
|--------|--------|-----|
| **Run** | Public `examples` only | `POST /api/problems/:topic/:slug/run` |
| **Submit** | `examples` + `edgeCases` | `POST /api/problems/:topic/:slug/submit` |

Body: `{ "code": "...", "language": "typescript" }`.  
Response includes `summary.passed/total` and per-case `inputs` / `expected` / `actual`.

## Scripts

| Script | Purpose |
|--------|---------|
| `yarn dev` | NestJS API + Vite React UI |
| `yarn test:solutions` | Run all problem tests (via cases.json) |
| `yarn build` | Build API and UI |
| `yarn workspace api dev` | API only (watch) |

## Prep lists

Coverage for your Easy / Medium LeetCode lists is under **Lists** in the UI, backed by [`lists/`](./lists/).
