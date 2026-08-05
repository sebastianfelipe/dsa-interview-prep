# TypeScript Interview Templates

Copy these skeletons into a scratchpad. Prefer clear types over cleverness.

## Contents

| File | Use when |
|------|----------|
| [two-pointers.ts](./two-pointers.ts) | Sorted pairs, palindrome, opposite/same-direction pointers |
| [sliding-window.ts](./sliding-window.ts) | Subarray/substring constraints |
| [prefix-sum.ts](./prefix-sum.ts) | Range sums, subarray sum = k |
| [linked-list.ts](./linked-list.ts) | ListNode helpers, reverse, fast/slow |
| [tree.ts](./tree.ts) | TreeNode, DFS/BFS skeletons |
| [graph.ts](./graph.ts) | Adj list, BFS/DFS, grid flood fill |
| [heap.ts](./heap.ts) | Priority queue patterns (manual / library notes) |
| [backtracking.ts](./backtracking.ts) | Subsets / permutations / combinations |
| [dp.ts](./dp.ts) | 1D / 2D DP starters |
| [binary-search.ts](./binary-search.ts) | Index search + search-on-answer |
| [union-find.ts](./union-find.ts) | Disjoint set |
| [trie.ts](./trie.ts) | Prefix tree |

## Interview TypeScript tips

- Clarify: arrays are `number[]`, strings are UTF-16 code units (fine for LeetCode ASCII).
- Prefer `const` / `let`; avoid `var`.
- `Map` / `Set` for hashing (clearer than plain objects for non-string keys).
- For heaps: say you'll use a `PriorityQueue` if the platform provides one; otherwise implement a binary heap or sort when n is small.
- State complexity assuming `Map` ops are amortized O(1).

## Minimal local setup (optional)

```bash
npm init -y
npm i -D typescript tsx @types/node
npx tsc --init
npx tsx path/to/file.ts
```

You do **not** need a full project to study — reading `.md` + typing solutions in an online pad is enough.
