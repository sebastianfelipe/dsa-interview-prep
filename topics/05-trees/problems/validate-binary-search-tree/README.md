# Validate Binary Search Tree

## Problem

Determine if a tree is a valid BST.

## Examples

### Example 1
**Input:** `root = [2, 1, 3]`
**Output:** `true`

### Example 2
**Input:** `root = [5, 1, 4, null, null, 3, 6]`
**Output:** `false`
**Explanation:** `4` is on the right of `5` but has a `3` left child.


## Recognition

BST bounds / inorder strictly increasing — **not** only `left < node < right` locally (fails on deeper violations).

## Pitfalls

- Using `<=` vs `<` incorrectly with duplicates (problem usually forbids dups)
- Number.MIN_SAFE_INTEGER tricks — prefer `null` bounds

## Key Extract

Pass **allowed (low, high)** range down. Classic trap problem — mention the counterexample of `[5,4,6,null,null,3,7]` in interviews.
