# Clone Graph

## Problem

Deep clone a connected undirected graph of `Node { val, neighbors }`.

## Recognition

Graph copy → DFS/BFS with **map old → new**.

## Code (TypeScript)

```ts
function cloneGraph(node: Node | null): Node | null {
  if (!node) return null;
  const map = new Map<Node, Node>();

  const dfs = (n: Node): Node => {
    if (map.has(n)) return map.get(n)!;
    const copy = new Node(n.val);
    map.set(n, copy);
    for (const nei of n.neighbors) {
      copy.neighbors.push(dfs(nei));
    }
    return copy;
  };

  return dfs(node);
}
```

## Key Extract

Create clone **before** recursing neighbors (breaks cycles). Map prevents infinite loops.
