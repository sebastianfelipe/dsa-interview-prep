# Complexity Cheatsheet

## Data structure operations

| Structure | Access | Search | Insert | Delete | Notes |
|-----------|--------|--------|--------|--------|-------|
| Array / List | O(1) | O(n) | O(n) mid / O(1) end* | O(n) | *amortized append |
| Hash Map / Set | — | O(1)* | O(1)* | O(1)* | *average; worst O(n) |
| Linked List | O(n) | O(n) | O(1) at known node | O(1) at known node | No random access |
| Stack / Queue | top/front O(1) | O(n) | O(1) | O(1) | |
| Binary Heap | — | O(n) | O(log n) | O(log n) peek O(1) | Top-K friend |
| BST (balanced) | — | O(log n) | O(log n) | O(log n) | AVL / Red-Black |
| Trie | — | O(L) | O(L) | O(L) | L = key length |
| Union-Find (DSU) | — | — | — | — | nearly O(1) find/union |

## Algorithm families

| Algorithm | Time | Space |
|-----------|------|-------|
| Binary search | O(log n) | O(1) |
| Merge sort | O(n log n) | O(n) |
| Quick sort (avg) | O(n log n) | O(log n) |
| Counting / bucket (bounded) | O(n + k) | O(k) |
| BFS / DFS on graph | O(V + E) | O(V) |
| Dijkstra (binary heap) | O((V+E) log V) | O(V) |
| Topological sort | O(V + E) | O(V) |
| Kruskal + DSU | O(E log E) | O(V) |

## Constraint → target complexity

| n (typical) | Acceptable |
|-------------|------------|
| n ≤ 20 | O(2ⁿ), O(n!) with pruning |
| n ≤ 100 | O(n³) sometimes |
| n ≤ 1,000 | O(n²) |
| n ≤ 10⁵–10⁶ | O(n) or O(n log n) |
| n ≤ 10⁹ / value range huge | O(log n) / math / binary search on answer |

## Key Extract

Read constraints first. They are a free hint for which pattern is expected.
