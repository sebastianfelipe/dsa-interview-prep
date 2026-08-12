# Subsets

## Problem

Return all subsets of `nums` (unique elements).

## Examples

### Example 1
**Input:** `nums = [1, 2, 3]`
**Output:** `[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]`
**Explanation:** All subsets of the set.


## Recognition

Classic backtracking / start-index DFS.

## Key Extract

Record path at every node (not only leaves). Choose then undo. O(n·2ⁿ) outputs.
