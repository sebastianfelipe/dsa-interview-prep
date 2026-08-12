# Symmetric Tree

## Problem

Given the `root` of a binary tree, check whether it is a mirror of itself (symmetric around its center).

## Examples

### Example 1
**Input:** `root = [1, 2, 2, 3, 4, 4, 3]`
**Output:** `true`
**Explanation:** The tree is a mirror around the center.

### Example 2
**Input:** `root = [1, 2, 2, null, 3, null, 3]`
**Output:** `false`.


## Recognition

Mirror symmetry → compare left and right subtrees as mirrors of each other.

## Key Extract

Helper `mirror(a, b)`: both null ok; one null or values differ fail; recurse `mirror(a.left, b.right)` and `mirror(a.right, b.left)`.
