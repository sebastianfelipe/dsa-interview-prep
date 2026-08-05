# Pattern: BFS Shortest Path (Unweighted)

## Recognition

- Shortest path in unweighted graph / grid
- Minimum moves / minimum levels

## Idea

BFS guarantees first time you reach target is minimum edges.

```ts
const dist = new Map<number, number>([[start, 0]]);
const queue = [start];
let head = 0;
while (head < queue.length) {
  const node = queue[head++]!;
  if (node === target) return dist.get(node)!;
  for (const nei of graph.get(node) ?? []) {
    if (!dist.has(nei)) {
      dist.set(nei, dist.get(node)! + 1);
      queue.push(nei);
    }
  }
}
```

## Key Extract

Unweighted → BFS. Weighted → Dijkstra. 0-1 weights → deque (0-1 BFS).
