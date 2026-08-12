# Coin Change

## Problem

Fewest coins to make `amount`. Coins unlimited. Return -1 if impossible.

## Examples

### Example 1
**Input:** `coins = [1, 2, 5]`, `amount = 11`
**Output:** `3`
**Explanation:** `5 + 5 + 1`.

### Example 2
**Input:** `coins = [2]`, `amount = 3`
**Output:** `-1`.


## Recognition

Unbounded knapsack / 1D DP on amount.

## Key Extract

`dp[amount]` min coins. Init `dp[0]=0`, others INF. Unbounded → for each amount try all coins (or coins outer with forward capacity loop).
