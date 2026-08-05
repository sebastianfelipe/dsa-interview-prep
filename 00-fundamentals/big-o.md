# Big-O Complexity

## What Big-O measures

Big-O describes how runtime/memory grow as input size `n` grows — worst case unless stated otherwise.

| Notation | Name | Feel |
|----------|------|------|
| O(1) | Constant | Hash map lookup, array index |
| O(log n) | Logarithmic | Binary search, balanced tree height |
| O(n) | Linear | Single pass |
| O(n log n) | Linearithmic | Sorting, heap build + n ops |
| O(n²) | Quadratic | Nested loops over n |
| O(n³) | Cubic | Triple nested loops |
| O(2ⁿ) | Exponential | Subsets without pruning, naive recursion |
| O(n!) | Factorial | Permutations |

## How to compute it quickly

1. Find the dominant loop / recursion.
2. Count how many times the core work runs in terms of `n`.
3. Drop constants and lower-order terms: `3n² + 2n` → `O(n²)`.
4. For nested structures: multiply when independent, add when sequential.

```text
for i in range(n):        # n
    for j in range(n):    # n  → O(n²)
        ...

for i in range(n): ...    # n
for j in range(n): ...    # n  → O(n) + O(n) = O(n)
```

## Recursion

- Depth `d`, work `w` per call → roughly `O(w * branching^d)` unless memoized.
- Tree DFS visits each node once → `O(n)` time, `O(h)` stack space.
- Memoized DP: states × transition cost.

## Space complexity

Count **extra** space beyond the input (unless asked for total).

| Pattern | Typical extra space |
|---------|---------------------|
| In-place two pointers | O(1) |
| Hash map of frequencies | O(k) unique keys |
| Recursion on tree height h | O(h) call stack |
| DP table `dp[n][m]` | O(n·m) (sometimes compressible to O(min(n,m))) |
| BFS queue | O(width) |

## Interview line you should say

> "I'll aim for O(n) time and O(1) extra space if possible. If I need lookups, I'll trade for O(n) space with a hash map."

## Key Extract

- Always state **time and space** after outlining an approach.
- Prefer `O(n)` or `O(n log n)` for n ≤ 10⁵; `O(n²)` only if n ≤ ~10³–10⁴.
- Constraints on the problem **hint** the expected complexity.
