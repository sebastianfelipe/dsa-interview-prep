# House Robber

## Problem

Rob houses in a line; cannot rob adjacent. Max money.

## Recognition

1D DP: rob or skip current.

```text
dp[i] = max(dp[i-1], dp[i-2] + nums[i])
```

## Key Extract

At each house: skip (take prev1) or rob (prev2 + money). House Robber II = max of linear on [0..n-2] vs [1..n-1].
