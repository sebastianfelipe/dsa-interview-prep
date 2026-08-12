# Keys and Rooms

## Problem

There are `n` rooms labeled `0` to `n-1`. You start in room `0` with all its keys. Each room `i` contains a list of keys for other rooms. Return `true` if you can visit every room.

## Examples

### Example 1
**Input:** `rooms = [[1], [2], [3], []]`
**Output:** `true`
**Explanation:** Keys chain 0→1→2→3 opens every room.

### Example 2
**Input:** `rooms = [[1, 3], [3, 0, 1], [2], [0]]`
**Output:** `false`
**Explanation:** Room `2` is never reachable.


## Recognition

Reachability from room 0 via keys → DFS/BFS graph traversal.

## Key Extract

Treat rooms as nodes and keys as directed edges. Visit from 0; success if visited count equals `n`.
