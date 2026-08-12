# Binary Tree Inorder Traversal

## Problem

Given the `root` of a binary tree, return the inorder traversal of its nodes' values (left → root → right).

## Examples

### Example 1
**Input:** `root = [1, null, 2, 3]`
**Output:** `[1, 3, 2]`
**Explanation:** Inorder is left → node → right.


## Recognition

Tree visit order left-root-right → recursive DFS or iterative stack.

## Key Extract

Recursive form is the clearest. Iterative: go left while pushing, pop to visit, then go right.
