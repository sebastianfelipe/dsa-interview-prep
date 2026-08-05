# Number of Islands

## Problem

Count islands of `'1'`s (4-connected) in a grid.

## Recognition

Connected components on a grid → DFS/BFS flood fill.

## Code (TypeScript)

```ts
function numIslands(grid: string[][]): number {
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
```

## Key Extract

Each unvisited land starts one component; sink the whole island. Ask before mutating input — else use visited matrix.
