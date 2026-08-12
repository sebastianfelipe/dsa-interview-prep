# Number of Islands

## Problem

Count islands of `'1'`s (4-connected) in a grid.

## Examples

### Example 1
**Input:**
```
grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
```
**Output:** `3`
**Explanation:** Three separate land components (top-left block, single `1` in the middle, and the bottom-right pair).


## Recognition

Connected components on a grid → DFS/BFS flood fill.

## Key Extract

Each unvisited land starts one component; sink the whole island. Ask before mutating input — else use visited matrix.
