# Permutations

## Problem

Return all permutations of distinct `nums`.

## Examples

### Example 1
**Input:** `nums = [1, 2, 3]`
**Output:** all orderings like `[1,2,3]`, `[1,3,2]`, …


## Key Extract

`used[]` tracks choices. For duplicates (Permutations II), sort + skip `nums[i]===nums[i-1] && !used[i-1]`.
