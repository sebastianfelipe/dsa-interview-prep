# Pattern Cheat Sheet (1 page)

Print or keep open during practice.

## Arrays / Strings
- Contiguous + constraint → **sliding window**
- Sorted pair → **two pointers**
- Subarray sum count → **prefix + Map**
- Max subarray sum → **Kadane**

## Hashing
- Unsorted two-sum → **complement Map**
- Anagrams → **signature group**
- Top K freq → **freq + heap/buckets**

## Linked List
- Cycle / mid → **fast/slow**
- Reverse → **prev/curr/next**
- Head changes → **dummy**

## Stack
- Brackets / nesting → **stack**
- Next greater → **monotonic stack**

## Tree
- Levels → **BFS**
- Path / aggregate → **DFS**
- BST → **bounds / inorder**

## Graph
- Components / islands → **DFS/BFS**
- Unweighted shortest → **BFS**
- Prerequisites → **topo (Kahn)**
- Dynamic connectivity → **Union-Find**

## Heap
- Kth / top K → **size-k heap**
- Merge k lists → **heap of heads**
- Running median → **two heaps**

## Backtracking
- Subsets / combos / perms / search → **choose · recurse · undo**

## DP
- Name **state → recurrence → base → order**
- Coins unlimited → **unbounded knapsack**
- Grid paths → **dp[r][c]**

## Search
- Sorted → **binary search**
- Min capacity / max min → **BS on answer**

## Intervals
- Overlaps → **sort + merge**
- Rooms needed → **sweep / heap of ends**

## SQL
- Conditional column → **CASE WHEN**
- Keep zeros → **LEFT JOIN** (filter in `ON`)
- "Did not" → **anti-join** (`IS NULL` / `NOT EXISTS`)
- At least N per group → **GROUP BY + HAVING**
- Yesterday → **self-join on `date + 1`**
- First year/login → **MIN, then join/IN**
- Rank / 7-day avg → **window (`DENSE_RANK`, `RANGE`)**
