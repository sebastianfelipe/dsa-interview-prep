# DSA Interview Prep

A structured, pattern-first guide for LeetCode-style coding interviews. Every topic includes **concepts**, **recognition signals**, **worked examples**, and a **Key Extract** section — the reusable ideas you should take into the next problem.

## Study UI (DSA Studio)

```bash
npm install
npm run dev
```

Open **http://localhost:5173** — browse by Easy / Medium / Hard, reveal TypeScript solutions, run tests, and track your [Easy](https://leetcode.com/problem-list/2z168m6d/) / [Medium](https://leetcode.com/problem-list/vylst5u7/) prep lists. Details in [`STUDIO.md`](./STUDIO.md).

## Repo layout

| Path | Purpose |
|------|---------|
| [`api/`](./api/) | NestJS API (catalog, docs, test runner) |
| [`ui/`](./ui/) | Vite React study UI |
| [`topics/`](./topics/) | Curriculum topics `00`–`16` |
| [`resources/`](./resources/) | Patterns, cheat sheets, study plans, templates |
| [`lists/`](./lists/) | Easy / Medium prep-list coverage |
| [`lib/`](./lib/) | Shared helpers for solutions and tests |

## How to use this repo

1. Start with [`topics/00-fundamentals/`](./topics/00-fundamentals/) — complexity, interview strategy, and how to talk through solutions.
2. Skim [`resources/patterns/master-pattern-list.md`](./resources/patterns/master-pattern-list.md) and [`resources/cheat-sheets/`](./resources/cheat-sheets/) — these are your recognition maps.
3. Work topics in order (or follow a [`resources/study-plans/`](./resources/study-plans/) plan), or use the Study UI.
4. For each problem folder, read `README.md` then reveal `solution.ts`:
   - **Recognition** → when to reach for this pattern
   - **Intuition** → why the approach works
   - **Walkthrough** → apply it on a concrete input
   - **Solution** → `solution.ts` (interview-ready TypeScript)
   - **Key Extract** → what to memorize and reuse

## Folder map

| # | Topic | Core patterns |
|---|--------|---------------|
| 00 | [Fundamentals](./topics/00-fundamentals/) | Big-O, strategy, communication |
| 01 | [Arrays & Strings](./topics/01-arrays-and-strings/) | Two pointers, sliding window, prefix sum |
| 02 | [Hashing](./topics/02-hashing/) | Frequency maps, complement lookup |
| 03 | [Linked Lists](./topics/03-linked-lists/) | Fast/slow, reverse, dummy head |
| 04 | [Stacks & Queues](./topics/04-stacks-and-queues/) | Monotonic stack, dequeue simulation |
| 05 | [Trees](./topics/05-trees/) | DFS/BFS, BST, LCA, path problems |
| 06 | [Graphs](./topics/06-graphs/) | BFS/DFS, shortest path, components |
| 07 | [Heaps](./topics/07-heaps/) | Top-K, two heaps, merge K lists |
| 08 | [Recursion & Backtracking](./topics/08-recursion-and-backtracking/) | Subsets, permutations, prune |
| 09 | [Dynamic Programming](./topics/09-dynamic-programming/) | 1D/2D DP, knapsack, LIS |
| 10 | [Greedy](./topics/10-greedy/) | Interval, jump, local optima |
| 11 | [Sorting & Searching](./topics/11-sorting-and-searching/) | Binary search on value/answer |
| 12 | [Bit Manipulation](./topics/12-bit-manipulation/) | XOR tricks, bit masks |
| 13 | [Math & Geometry](./topics/13-math-and-geometry/) | GCD, matrix traversal |
| 14 | [Intervals](./topics/14-intervals/) | Merge, sweep line |
| 15 | [Tries](./topics/15-tries/) | Prefix trees, word search |
| 16 | [Advanced](./topics/16-advanced-topics/) | Union-Find, topo sort, segment trees |

Also under [`resources/`](./resources/):

- [`patterns/`](./resources/patterns/) — cross-cutting pattern index
- [`templates/`](./resources/templates/) — copy-paste code skeletons
- [`cheat-sheets/`](./resources/cheat-sheets/) — one-page lookups
- [`study-plans/`](./resources/study-plans/) — 2-week / 4-week / 8-week tracks

## Problem layout

```text
topics/NN-topic/problems/<slug>/
  meta.json          # title, leetcodeId, Easy|Medium|Hard, tags
  README.md          # description (no solution code)
  solution.ts
  solution.test.ts
```

README sections typically include:

```text
## Problem
## Recognition (signals → pattern)
## Intuition / Approach / Walkthrough
## Complexity
## Pitfalls
## Key Extract  ← read this last; this is what you reuse
```

## Suggested language

Examples use **TypeScript**. Interviewers often accept JS/TS; typed code also forces you to clarify inputs/outputs. Templates live in [`resources/templates/`](./resources/templates/).

## Progress tip

Treat each **Key Extract** as a flashcard. If you can name the pattern from the recognition signals alone, you are interview-ready for that family of problems.
