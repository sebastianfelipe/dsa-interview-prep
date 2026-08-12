# Remove Duplicates from Sorted Array

## Problem

Given a sorted array `nums`, remove duplicates in-place so each unique element appears once. Return `k`, the count of unique elements. The first `k` slots of `nums` must hold the unique values in order.

## Examples

### Example 1
**Input:** `nums = [1, 1, 2]`
**Output:** `2`, with `nums` beginning `[1, 2, _]`
**Explanation:** Keep unique values in-place; length of the unique prefix is `2`.


## Recognition

Sorted array + in-place unique → slow/fast two pointers.

## Key Extract

Advance the write pointer only when `nums[read] !== nums[write]`. Return `write + 1`.
