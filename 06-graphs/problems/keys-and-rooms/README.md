# Keys and Rooms

## Problem

There are `n` rooms labeled `0` to `n-1`. You start in room `0` with all its keys. Each room `i` contains a list of keys for other rooms. Return `true` if you can visit every room.

## Recognition

Reachability from room 0 via keys → DFS/BFS graph traversal.

## Key Extract

Treat rooms as nodes and keys as directed edges. Visit from 0; success if visited count equals `n`.
