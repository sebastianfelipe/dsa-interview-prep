# Pattern: LIS & Sequence DP

## Recognition

- Longest increasing subsequence
- Longest common subsequence / substring
- Russian doll envelopes

## Approaches for LIS

- O(n²): `dp[i] = max(dp[j]+1)` for j < i and nums[j] < nums[i]
- O(n log n): patience sorting / tails binary search

## Key Extract

Sequence DP often `dp[i]` = best ending at i. LCS is a 2D grid over two strings.
