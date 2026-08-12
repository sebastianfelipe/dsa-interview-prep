# Same Tree

## Problem

Given the roots of two binary trees `p` and `q`, write a function to check if they are the same — structurally identical with the same node values.

## Examples

### Example 1
**Input:** `p = [1, 2, 3]`, `q = [1, 2, 3]`
**Output:** `true`

### Example 2
**Input:** `p = [1, 2]`, `q = [1, null, 2]`
**Output:** `false`
**Explanation:** Structure differs (left child vs right child).


## Recognition

Compare two trees structure + values → simultaneous DFS/BFS.

## Key Extract

Base cases: both null → true; one null or values differ → false; else recurse on left and right pairs.
