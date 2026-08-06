export function uniquePaths(m: number, n: number): number {
  const dp = new Array<number>(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[c] = dp[c]! + dp[c - 1]!;
    }
  }
  return dp[n - 1]!;
}
