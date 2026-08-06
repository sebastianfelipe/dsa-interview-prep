# Graphs

Nodes + edges. Grids are graphs with implicit 4/8-neighborhood.

## Patterns

| Pattern | File |
|---------|------|
| DFS / BFS traversal | [patterns/dfs-bfs.md](./patterns/dfs-bfs.md) |
| BFS shortest path | [patterns/bfs-shortest-path.md](./patterns/bfs-shortest-path.md) |
| Matrix flood fill | [patterns/matrix.md](./patterns/matrix.md) |

## Worked problems

| Problem | File |
|---------|------|
| Number of Islands | [problems/number-of-islands.md](./problems/number-of-islands.md) |
| Clone Graph | [problems/clone-graph.md](./problems/clone-graph.md) |
| Course Schedule | [problems/course-schedule.md](./problems/course-schedule.md) |

## Representations

```ts
// adjacency list
const graph = new Map<number, number[]>();

// edge list → adj
for (const [u, v] of edges) {
  graph.get(u)!.push(v);
  graph.get(v)!.push(u); // if undirected
}
```

## Key Extract

Mark **visited** early. Grid: mutate cell or use visited matrix. Dependencies: think topo sort.
