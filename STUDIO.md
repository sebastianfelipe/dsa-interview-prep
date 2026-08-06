# DSA Studio

Study UI for this repo: browse topics by difficulty, read pattern-first writeups, reveal TypeScript solutions, and run tests.

## Quick start

```bash
npm install
npm run dev
```

- UI: http://localhost:5173
- API: http://localhost:3001/api/catalog

## Repo layout

```text
api/           NestJS content + test-runner API
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
  solution.test.ts
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | NestJS API + Vite React UI |
| `npm run test:solutions` | Run all problem tests |
| `npm run build` | Build API and UI |

## Prep lists

Coverage for your Easy / Medium LeetCode lists is under **Lists** in the UI, backed by [`lists/`](./lists/).
