# Master Pattern List

Use this as a **recognition map**. Match problem signals → pattern → folder.

| Pattern | Signals | Go to |
|---------|---------|-------|
| Two pointers (opposite ends) | Sorted array, pair/triplet sum, palindrome | [01](../01-arrays-and-strings/patterns/two-pointers.md) |
| Two pointers (same direction) | Remove duplicates, fast/slow on arrays | [01](../01-arrays-and-strings/patterns/two-pointers.md) |
| Sliding window (fixed) | Subarray of size k, max/min in window | [01](../01-arrays-and-strings/patterns/sliding-window.md) |
| Sliding window (variable) | Longest/shortest subarray/substring with constraint | [01](../01-arrays-and-strings/patterns/sliding-window.md) |
| Prefix sum | Range sum queries, subarray sum = k | [01](../01-arrays-and-strings/patterns/prefix-sum.md) |
| Kadane | Max subarray sum | [01](../01-arrays-and-strings/patterns/kadane.md) |
| Frequency / complement hash | Two sum, anagrams, counting | [02](../02-hashing/) |
| Fast & slow pointers | Cycle, middle of list | [03](../03-linked-lists/patterns/fast-slow.md) |
| Reverse linked list | Reverse whole/partial list | [03](../03-linked-lists/patterns/reverse.md) |
| Dummy head | Insert/delete near head | [03](../03-linked-lists/patterns/dummy-head.md) |
| Stack (matching) | Valid parentheses, path simplify | [04](../04-stacks-and-queues/) |
| Monotonic stack | Next greater/smaller, histogram | [04](../04-stacks-and-queues/patterns/monotonic-stack.md) |
| Tree DFS | Path sum, serialize, diameter | [05](../05-trees/) |
| Tree BFS | Level order, right side view | [05](../05-trees/patterns/bfs-level-order.md) |
| BST property | Search/insert, kth small, validate | [05](../05-trees/patterns/bst.md) |
| Graph BFS/DFS | Islands, connectivity, clone graph | [06](../06-graphs/) |
| Shortest path (unweighted) | BFS levels | [06](../06-graphs/patterns/bfs-shortest-path.md) |
| Topological sort | Course schedule, build order | [16](../16-advanced-topics/topological-sort/) |
| Union-Find | Connected components, redundant connection | [16](../16-advanced-topics/union-find/) |
| Heap / Top-K | Kth largest, merge k streams | [07](../07-heaps/) |
| Two heaps | Running median | [07](../07-heaps/patterns/two-heaps.md) |
| Backtracking | Subsets, permutations, N-Queens, combinations | [08](../08-recursion-and-backtracking/) |
| DP 1D | Climb stairs, house robber, coins | [09](../09-dynamic-programming/) |
| DP 2D / grid | Unique paths, edit distance | [09](../09-dynamic-programming/patterns/grid-dp.md) |
| Knapsack family | 0/1, unbounded, subset sum | [09](../09-dynamic-programming/patterns/knapsack.md) |
| Greedy | Jump game, intervals, gas station | [10](../10-greedy/) |
| Binary search on index | Classic search, rotated array | [11](../11-sorting-and-searching/) |
| Binary search on answer | Minimize max / maximize min | [11](../11-sorting-and-searching/patterns/binary-search-on-answer.md) |
| Intervals | Merge, insert, meeting rooms | [14](../14-intervals/) |
| Trie | Prefix search, word dictionary | [15](../15-tries/) |
| Bit tricks | Single number, subsets mask | [12](../12-bit-manipulation/) |
| SQL CASE / projection | Conditional output column | [17](/reference/topics/17-sql/patterns/case-when) |
| SQL LEFT JOIN (keep zeros) | Every entity appears even with 0 events | [17](/reference/topics/17-sql/patterns/left-join) |
| SQL anti-join | In A but not in B | [17](/reference/topics/17-sql/patterns/anti-join) |
| SQL GROUP BY / HAVING | Filter groups ("at least N") | [17](/reference/topics/17-sql/patterns/group-by-having) |
| SQL self-join on dates | Yesterday / next calendar day | [17](/reference/topics/17-sql/patterns/self-join-dates) |
| SQL first event | Min date/year, then matching rows | [17](/reference/topics/17-sql/patterns/first-event) |
| SQL window functions | Rank, running total, moving average | [17](/reference/topics/17-sql/patterns/window-functions) |

## Decision tree (first 60 seconds)

```text
Is it a subarray/substring with a constraint?
  └─ Yes → sliding window / prefix+hash

Is the array sorted (or can I sort cheaply)?
  └─ Yes → two pointers / binary search / greedy on sorted

Do I need faster than O(n²) lookups or counts?
  └─ Yes → hash map/set

Linked list?
  └─ Fast/slow, reverse, dummy

Tree?
  └─ DFS (paths/properties) or BFS (levels)

Graph / grid connectivity?
  └─ DFS/BFS; if dependencies → topo; if merge sets → Union-Find

"Kth", "top K", "closest K", merge sorted streams?
  └─ Heap

Optimal counting / overlapping subproblems?
  └─ DP (define state first)

Local choice never hurts global?
  └─ Greedy (prove or cite known pattern)

Next greater / histogram / span?
  └─ Monotonic stack

SQL / result table?
  └─ Must keep unmatched → LEFT JOIN (filter in ON)
  └─ Must drop matched → anti-join
  └─ Filter on a count → GROUP BY + HAVING
  └─ Compare to yesterday → self-join on date + 1
  └─ Rank / moving average → window
```

## Key Extract

Spend interview minutes 2–5 on this map, not on coding. Wrong pattern = wasted time.
