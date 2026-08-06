# Lowest Common Ancestor of a Binary Search Tree

## Problem

Find LCA of nodes `p` and `q` in a BST.

## Recognition

BST ordering → walk down without full tree search.

## Key Extract

If both targets on one side, go there; else current node is LCA. For **binary tree** (not BST), use DFS returning found flags / nodes.
