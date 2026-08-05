# Union-Find (Disjoint Set Union)

## Recognition

- Connected components dynamically
- "Redundant connection" / accounts merge
- Cycle in undirected graph while adding edges
- Kruskal MST

## Operations

- `find(x)` — root with path compression
- `union(a,b)` — merge by rank/size; return false if already connected

Template: [`templates/union-find.ts`](../../templates/union-find.ts)

## Example: number of provinces

```ts
function findCircleNumber(isConnected: number[][]): number {
  const n = isConnected.length;
  const uf = new UnionFind(n);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i]![j]) uf.union(i, j);
    }
  }
  return uf.components;
}
```

## Complexity

Almost O(1) per op with path compression + union by rank (inverse Ackermann).

## Key Extract

Union-Find = dynamic connectivity. If `union` returns false, the edge formed a cycle.
