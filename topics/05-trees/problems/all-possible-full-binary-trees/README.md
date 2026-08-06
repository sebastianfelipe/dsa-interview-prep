# All Possible Full Binary Trees

## Problem

Given an integer `n`, return a list of all possible full binary trees with `n` nodes. Each node's value is `0`. A full binary tree is a binary tree where each node has exactly 0 or 2 children.

## Recognition

Odd `n` only (even impossible). Recursively split remaining nodes into left/right odd counts; memoize by `n`.

## Key Extract

For each odd left size `L` in `1..n-1`, right size is `n-1-L`. Cartesian product of left and right forests forms all trees rooted at a new node.
