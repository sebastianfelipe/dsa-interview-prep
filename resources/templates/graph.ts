/** Build adjacency list from edge list (undirected by default). */
export function buildGraph(
  n: number,
  edges: Array<[number, number]>,
  directed = false,
): Map<number, number[]> {
  const graph = new Map<number, number[]>();
  for (let i = 0; i < n; i++) graph.set(i, []);
  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    if (!directed) graph.get(v)!.push(u);
  }
  return graph;
}

/** BFS shortest path in unweighted graph — returns distance or -1. */
export function bfsDistance(
  graph: Map<number, number[]>,
  start: number,
  target: number,
): number {
  const queue: number[] = [start];
  let head = 0;
  const dist = new Map<number, number>([[start, 0]]);

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
  return -1;
}

/** Grid flood fill / number of islands style DFS. */
export function numIslands(grid: string[][]): number {
  if (!grid.length) return 0;
  const rows = grid.length;
  const cols = grid[0]!.length;
  let count = 0;

  const dfs = (r: number, c: number): void => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r]![c] !== "1") return;
    grid[r]![c] = "0";
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r]![c] === "1") {
        count += 1;
        dfs(r, c);
      }
    }
  }
  return count;
}
