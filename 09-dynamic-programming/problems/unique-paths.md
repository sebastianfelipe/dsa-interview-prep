# Unique Paths

## Problem

Robot from top-left to bottom-right on m×n grid; only right/down. Count paths.

## Recognition

Grid DP: `dp[r][c] = dp[r-1][c] + dp[r][c-1]`.

## Code (TypeScript)

```ts
function uniquePaths(m: number, n: number): number {
  const dp = new Array<number>(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[c] = dp[c]! + dp[c - 1]!;
    }
  }
  return dp[n - 1]!;
}
```

## Key Extract

First row/col = 1. Compress to 1D. Obstacles variant: blocked cell → 0.
