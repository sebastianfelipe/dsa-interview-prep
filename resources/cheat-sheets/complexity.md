# Big-O + Structure Cheatsheet

See also [Fundamentals · Complexity cheatsheet](/reference/topics/00-fundamentals/complexity-cheatsheet).

## TypeScript collection costs (amortized)

| Structure | Get | Set / Add | Delete | Notes |
|-----------|-----|-----------|--------|-------|
| `T[]` index | O(1) | O(1) end / O(n) mid | O(n) mid | `shift`/`unshift` are O(n) |
| `Map<K,V>` | O(1) | O(1) | O(1) | Prefer over `{}` for non-string keys |
| `Set<T>` | has O(1) | O(1) | O(1) | |
| string concat in loop | — | O(n²) risk | — | Push to `string[]` then `.join("")` |
| `queue.shift()` | — | — | O(n) | Use head index instead |

## Pattern → complexity targets

| Pattern | Time | Extra space |
|---------|------|-------------|
| Two pointers | O(n) | O(1) |
| Sliding window | O(n) | O(k) alphabet / distinct |
| Prefix + hash | O(n) | O(n) |
| Sort + two pointers | O(n log n) | O(1)–O(n) |
| Tree DFS/BFS | O(n) | O(h) / O(w) |
| Graph DFS/BFS | O(V+E) | O(V) |
| Heap top-k | O(n log k) | O(k) |
| Backtracking subsets | O(n·2ⁿ) | O(n) |
| 1D DP | O(n·T) | O(n) or O(1) |
| Binary search | O(log n) | O(1) |
