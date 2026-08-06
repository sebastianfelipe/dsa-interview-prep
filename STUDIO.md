# DSA Studio

Study UI for this repo: browse topics by difficulty, read pattern-first writeups, reveal TypeScript solutions, and run tests.

## Quick start

```bash
npm install
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:3001/api/catalog

## Problem layout

Each problem lives in its own folder:

```text
NN-topic/problems/<slug>/
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
| `npm run build` | Build API and web |

## Prep lists

Coverage for your Easy / Medium LeetCode lists is under **Lists** in the UI, backed by [`lists/`](./lists/).
