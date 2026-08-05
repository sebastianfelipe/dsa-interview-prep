# Pattern: Knapsack Family

## Recognition

| Flavor | Signal | Classic |
|--------|--------|---------|
| 0/1 | each item once | subset sum, partition |
| Unbounded | reuse OK | coin change |
| Bounded | limited copies | — |

## Unbounded (coin change min)

```text
dp[a] = min coins to make amount a
dp[a] = min(dp[a - coin] + 1)
```

## 0/1

Loop items outer; capacity **backward** when compressing to 1D so each item used once.

## Key Extract

Name the knapsack flavor first. Capacity dimension + item loop order encode the reuse rule.
