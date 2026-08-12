# Merge Intervals

## Problem

Merge all overlapping intervals.

## Examples

### Example 1
**Input:** `intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]`
**Output:** `[[1, 6], [8, 10], [15, 18]]`
**Explanation:** `[1,3]` and `[2,6]` overlap.


## Key Extract

Sort by start; extend or append. Insert Interval = merge after inserting into sorted place.
