# Binary Tree Level Order Traversal

## Problem

Return values level by level as `number[][]`.

## Examples

### Example 1
**Input:** `root = [3, 9, 20, null, null, 15, 7]`
**Output:** `[[3], [9, 20], [15, 7]]`.


## Recognition

**BFS** with level sizing.

## Key Extract

Freeze level `size`. Variants: zigzag (alternate reverse), right side view (`level[level.length-1]`).
