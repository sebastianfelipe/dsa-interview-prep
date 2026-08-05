# DSA Interview Prep

A structured, pattern-first guide for LeetCode-style coding interviews. Every topic includes **concepts**, **recognition signals**, **worked examples**, and a **Key Extract** section — the reusable ideas you should take into the next problem.

## How to use this repo

1. Start with [`00-fundamentals/`](./00-fundamentals/) — complexity, interview strategy, and how to talk through solutions.
2. Skim [`patterns/master-pattern-list.md`](./patterns/master-pattern-list.md) and [`cheat-sheets/`](./cheat-sheets/) — these are your recognition maps.
3. Work topics in order (or follow a [`study-plans/`](./study-plans/) plan).
4. For each problem file, read in this order:
   - **Recognition** → when to reach for this pattern
   - **Intuition** → why the approach works
   - **Walkthrough** → apply it on a concrete input
   - **Code** → a clean interview-ready solution
   - **Key Extract** → what to memorize and reuse

## Folder map

| # | Topic | Core patterns |
|---|--------|---------------|
| 00 | [Fundamentals](./00-fundamentals/) | Big-O, strategy, communication |
| 01 | [Arrays & Strings](./01-arrays-and-strings/) | Two pointers, sliding window, prefix sum |
| 02 | [Hashing](./02-hashing/) | Frequency maps, complement lookup |
| 03 | [Linked Lists](./03-linked-lists/) | Fast/slow, reverse, dummy head |
| 04 | [Stacks & Queues](./04-stacks-and-queues/) | Monotonic stack, dequeue simulation |
| 05 | [Trees](./05-trees/) | DFS/BFS, BST, LCA, path problems |
| 06 | [Graphs](./06-graphs/) | BFS/DFS, shortest path, components |
| 07 | [Heaps](./07-heaps/) | Top-K, two heaps, merge K lists |
| 08 | [Recursion & Backtracking](./08-recursion-and-backtracking/) | Subsets, permutations, prune |
| 09 | [Dynamic Programming](./09-dynamic-programming/) | 1D/2D DP, knapsack, LIS |
| 10 | [Greedy](./10-greedy/) | Interval, jump, local optima |
| 11 | [Sorting & Searching](./11-sorting-and-searching/) | Binary search on value/answer |
| 12 | [Bit Manipulation](./12-bit-manipulation/) | XOR tricks, bit masks |
| 13 | [Math & Geometry](./13-math-and-geometry/) | GCD, matrix traversal |
| 14 | [Intervals](./14-intervals/) | Merge, sweep line |
| 15 | [Tries](./15-tries/) | Prefix trees, word search |
| 16 | [Advanced](./16-advanced-topics/) | Union-Find, topo sort, segment trees |

Also:

- [`patterns/`](./patterns/) — cross-cutting pattern index
- [`templates/`](./templates/) — copy-paste code skeletons
- [`cheat-sheets/`](./cheat-sheets/) — one-page lookups
- [`study-plans/`](./study-plans/) — 2-week / 4-week / 8-week tracks

## Problem file template (every example follows this)

```text
## Problem
## Recognition (signals → pattern)
## Intuition
## Approach
## Walkthrough (concrete input)
## Complexity
## Code
## Pitfalls
## Key Extract  ← read this last; this is what you reuse
```

## Suggested language

Examples use **TypeScript**. Interviewers often accept JS/TS; typed code also forces you to clarify inputs/outputs. Templates live in [`templates/`](./templates/).

## Progress tip

Treat each **Key Extract** as a flashcard. If you can name the pattern from the recognition signals alone, you are interview-ready for that family of problems.
