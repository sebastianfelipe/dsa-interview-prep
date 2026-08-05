# Pattern: 1D DP

## Recognition

- Linear choices along an array/string
- Climb stairs, house robber, decode ways
- "Decision at i depends on i-1 / i-2"

## Template thinking

```text
dp[i] = best/count for prefix nums[0..i)
dp[i] = f(dp[i-1], dp[i-2], …)
```

Often compress to a few variables (`prev`, `curr`).

## Key Extract

Reduce "what changes between subproblems" to indices along one axis.
