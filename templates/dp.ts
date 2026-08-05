/** 1D DP — climbing stairs (fibonacci). */
export function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

/** Grid DP — unique paths. */
export function uniquePaths(m: number, n: number): number {
  const dp = new Array<number>(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[c] = dp[c]! + dp[c - 1]!;
    }
  }
  return dp[n - 1]!;
}

/** Unbounded knapsack — coin change (min coins). */
export function coinChange(coins: number[], amount: number): number {
  const INF = amount + 1;
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a]!, dp[a - coin]! + 1);
    }
  }
  return dp[amount]! > amount ? -1 : dp[amount]!;
}

/**
 * DP checklist (say this in interviews):
 * 1. What is the state?
 * 2. What is the recurrence?
 * 3. Base cases?
 * 4. Iteration order / memo?
 * 5. Where is the answer?
 */
