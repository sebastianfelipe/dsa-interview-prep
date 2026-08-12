# Remove Element

## Problem

Given an integer array `nums` and value `val`, remove all occurrences of `val` in-place. Return `k`, the number of elements not equal to `val`. The first `k` elements of `nums` should contain those values (order may change).

## Examples

### Example 1
**Input:** `nums = [3, 2, 2, 3]`, `val = 3`
**Output:** `2`, with `nums` beginning `[2, 2, _, _]`
**Explanation:** Remove every `3` in-place; keep order of the rest as you like.


## Recognition

In-place filter by value → two pointers (write/read) or swap-with-end.

## Key Extract

Copy keepers forward with a write index; ignore matches. Return the write index as `k`.
