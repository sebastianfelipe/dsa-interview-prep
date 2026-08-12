# Search in Rotated Sorted Array

## Problem

Search `target` in rotated sorted array of distinct ints. O(log n).

## Examples

### Example 1
**Input:** `nums = [4, 5, 6, 7, 0, 1, 2]`, `target = 0`
**Output:** `4`.


## Key Extract

Each step: which half is sorted? Is target in that half? Discard accordingly.
