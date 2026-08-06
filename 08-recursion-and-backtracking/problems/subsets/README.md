# Subsets

## Problem

Return all subsets of `nums` (unique elements).

## Recognition

Classic backtracking / start-index DFS.

## Key Extract

Record path at every node (not only leaves). Choose then undo. O(n·2ⁿ) outputs.
