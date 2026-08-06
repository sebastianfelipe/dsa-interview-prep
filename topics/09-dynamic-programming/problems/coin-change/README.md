# Coin Change

## Problem

Fewest coins to make `amount`. Coins unlimited. Return -1 if impossible.

## Recognition

Unbounded knapsack / 1D DP on amount.

## Key Extract

`dp[amount]` min coins. Init `dp[0]=0`, others INF. Unbounded → for each amount try all coins (or coins outer with forward capacity loop).
