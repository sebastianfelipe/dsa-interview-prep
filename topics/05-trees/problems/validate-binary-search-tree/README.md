# Validate Binary Search Tree

## Problem

Determine if a tree is a valid BST.

## Recognition

BST bounds / inorder strictly increasing — **not** only `left < node < right` locally (fails on deeper violations).

## Pitfalls

- Using `<=` vs `<` incorrectly with duplicates (problem usually forbids dups)
- Number.MIN_SAFE_INTEGER tricks — prefer `null` bounds

## Key Extract

Pass **allowed (low, high)** range down. Classic trap problem — mention the counterexample of `[5,4,6,null,null,3,7]` in interviews.
