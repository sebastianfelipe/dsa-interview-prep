# Coin Change

## Problem

Fewest coins to make `amount`. Coins unlimited. Return -1 if impossible.

## Recognition

Unbounded knapsack / 1D DP on amount.

## Code (TypeScript)

```ts
function coinChange(coins: number[], amount: number): number {
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
```

## Key Extract

`dp[amount]` min coins. Init `dp[0]=0`, others INF. Unbounded → for each amount try all coins (or coins outer with forward capacity loop).
