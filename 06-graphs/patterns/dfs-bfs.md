# Pattern: Graph DFS / BFS

## Recognition

- Connected components
- Reachability
- Clone / copy graph
- Cycle detection (careful with directed vs undirected)

## DFS

```ts
const visited = new Set<number>();
function dfs(node: number): void {
  if (visited.has(node)) return;
  visited.add(node);
  for (const nei of graph.get(node) ?? []) dfs(nei);
}
```

## BFS

Queue + visited; process layer by layer (see shortest path pattern).

## Key Extract

Same traversal, different data structure (stack/recursion vs queue). Components = count of DFS/BFS starts from unvisited nodes.
