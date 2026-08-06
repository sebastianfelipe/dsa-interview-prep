# Symmetric Tree

## Problem

Given the `root` of a binary tree, check whether it is a mirror of itself (symmetric around its center).

## Recognition

Mirror symmetry → compare left and right subtrees as mirrors of each other.

## Key Extract

Helper `mirror(a, b)`: both null ok; one null or values differ fail; recurse `mirror(a.left, b.right)` and `mirror(a.right, b.left)`.
