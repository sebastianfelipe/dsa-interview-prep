# Clone Graph

## Problem

Deep clone a connected undirected graph of `Node { val, neighbors }`.

## Examples

### Example
**Input:** adjacency list `[[2,4],[1,3],[2,4],[1,3]]` (node 1 connected to 2 and 4, …)
**Output:** A deep copy with the same connections.


## Recognition

Graph copy → DFS/BFS with **map old → new**.

## Key Extract

Create clone **before** recursing neighbors (breaks cycles). Map prevents infinite loops.
