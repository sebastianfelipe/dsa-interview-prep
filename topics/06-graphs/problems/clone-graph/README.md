# Clone Graph

## Problem

Deep clone a connected undirected graph of `Node { val, neighbors }`.

## Recognition

Graph copy → DFS/BFS with **map old → new**.

## Key Extract

Create clone **before** recursing neighbors (breaks cycles). Map prevents infinite loops.
