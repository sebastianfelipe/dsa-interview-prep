# Subarray Sum Equals K

## Problem

Given `nums` (ints, may be negative) and `k`, return the **number** of contiguous subarrays that sum to `k`.

## Recognition

| Signal | Points to |
|--------|-----------|
| Contiguous subarray sum | Prefix sums |
| Count how many | Hash map of prefix frequencies |
| Negatives allowed | Sliding window on sum does **not** work |

## Intuition

`sum(i..j) = prefix[j+1] - prefix[i]`. For each ending index, count prior prefixes equal to `currentPrefix - k`.

## Approach

1. `seen = Map { 0 → 1 }` (empty prefix).
2. Walk array, update prefix, add `seen.get(prefix - k)`, then record prefix.

## Walkthrough

`nums = [1,2,3], k = 3`

| num | prefix | prefix-k | add | seen after |
|-----|--------|----------|-----|------------|
| 1 | 1 | -2 | 0 | {0:1, 1:1} |
| 2 | 3 | 0 | 1 | {0:1, 1:1, 3:1} |
| 3 | 6 | 3 | 1 | {0:1, 1:1, 3:1, 6:1} |

Count = 2 → `[1,2]` and `[3]`.

## Complexity

Time O(n), space O(n).

## Pitfalls

- Forgetting the initial `{0: 1}` (misses subarrays starting at index 0)
- Using sliding window (fails with negatives)
- Updating map before querying complement (can double-count self incorrectly)

## Key Extract

**Prefix + frequency map** for subarray sum counts. If all nums are positive and you need longest/shortest with sum ≥ k, then sliding window becomes valid instead.
