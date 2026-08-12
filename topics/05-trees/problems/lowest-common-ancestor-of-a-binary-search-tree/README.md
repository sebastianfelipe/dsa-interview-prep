# Lowest Common Ancestor of a Binary Search Tree

## Problem

Find LCA of nodes `p` and `q` in a BST.

## Examples

### Example 1
**Input:** `root = [6, 2, 8, 0, 4, 7, 9]`, `p = 2`, `q = 8`
**Output:** `6`
**Explanation:** `6` is the split point between left and right.


## Recognition

BST ordering → walk down without full tree search.

## Key Extract

If both targets on one side, go there; else current node is LCA. For **binary tree** (not BST), use DFS returning found flags / nodes.
