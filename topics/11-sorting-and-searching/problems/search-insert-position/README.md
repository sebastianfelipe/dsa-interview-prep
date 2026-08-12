# Search Insert Position

## Problem

Given a sorted array of distinct integers and a target, return the index if the target is found. If not, return the index where it would be inserted to keep the array sorted.

## Examples

### Example 1
**Input:** `nums = [1, 3, 5, 6]`, `target = 5`
**Output:** `2`

### Example 2
**Input:** `nums = [1, 3, 5, 6]`, `target = 2`
**Output:** `1`
**Explanation:** `2` belongs between `1` and `3`.


## Recognition

Sorted + find position → classic binary search returning the lower bound / insertion index.

## Key Extract

Maintain `lo`/`hi` so `lo` converges to the first index with `nums[i] >= target`. That is the answer whether found or not.
