# Permutations

## Problem

Return all permutations of distinct `nums`.

## Key Extract

`used[]` tracks choices. For duplicates (Permutations II), sort + skip `nums[i]===nums[i-1] && !used[i-1]`.
