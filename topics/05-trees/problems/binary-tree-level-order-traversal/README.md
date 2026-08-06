# Binary Tree Level Order Traversal

## Problem

Return values level by level as `number[][]`.

## Recognition

**BFS** with level sizing.

## Key Extract

Freeze level `size`. Variants: zigzag (alternate reverse), right side view (`level[level.length-1]`).
