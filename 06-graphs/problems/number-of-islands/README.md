# Number of Islands

## Problem

Count islands of `'1'`s (4-connected) in a grid.

## Recognition

Connected components on a grid → DFS/BFS flood fill.

## Key Extract

Each unvisited land starts one component; sink the whole island. Ask before mutating input — else use visited matrix.
