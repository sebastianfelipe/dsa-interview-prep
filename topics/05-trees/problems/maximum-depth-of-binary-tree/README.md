# Maximum Depth of Binary Tree

## Problem

Return max depth (root to farthest leaf).

## Examples

### Example 1
**Input:** `root = [3, 9, 20, null, null, 15, 7]`
**Output:** `3`.


## Recognition

DFS aggregate from children — or BFS counting levels.

## Key Extract

Base null → 0. Depth = 1 + max(children). Same shape as invert-tree / same-tree comparisons.
