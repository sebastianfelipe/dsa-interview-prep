# Maximum Depth of Binary Tree

## Problem

Return max depth (root to farthest leaf).

## Recognition

DFS aggregate from children — or BFS counting levels.

## Key Extract

Base null → 0. Depth = 1 + max(children). Same shape as invert-tree / same-tree comparisons.
