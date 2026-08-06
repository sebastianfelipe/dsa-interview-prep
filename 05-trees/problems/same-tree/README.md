# Same Tree

## Problem

Given the roots of two binary trees `p` and `q`, write a function to check if they are the same — structurally identical with the same node values.

## Recognition

Compare two trees structure + values → simultaneous DFS/BFS.

## Key Extract

Base cases: both null → true; one null or values differ → false; else recurse on left and right pairs.
