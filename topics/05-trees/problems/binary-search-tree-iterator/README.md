# Binary Search Tree Iterator

## Problem

Implement the `BSTIterator` class that represents an in-order iterator over a BST: `BSTIterator(root)`, `next()` returns the next smallest number, and `hasNext()` returns whether a next smallest number exists. Amortized O(1) `next` and O(h) space preferred.

## Examples

### Example
**Tree** `[7, 3, 15, null, null, 9, 20]`
`next()` sequence yields `3, 7, 9, 15, 20` (inorder).


## Recognition

Controlled inorder traversal → stack of leftmost path (controlled recursion).

## Key Extract

Constructor pushes the left spine. `next` pops, then pushes the left spine of the popped node's right child. `hasNext` is simply stack non-empty.
