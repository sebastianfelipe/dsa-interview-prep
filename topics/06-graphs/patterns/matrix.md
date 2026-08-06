# Pattern: Matrix / Grid as Graph

## Recognition

- Islands, flood fill, walls and gates
- Unique paths with obstacles (sometimes DP instead)
- Word search (backtracking on grid)

## Moves

```ts
const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

function inBounds(r: number, c: number, rows: number, cols: number): boolean {
  return r >= 0 && c >= 0 && r < rows && c < cols;
}
```

## Key Extract

Each cell is a node; edges to neighbors. Mark visited (or mutate) to avoid revisiting.
