# Pattern: Grid DP

## Recognition

- Unique paths / min path sum
- Dungeon game, falling path
- Edit distance / LCS (2-string grids)

## Idea

`dp[r][c]` from top/left (or other dirs). Can often compress to 1D rolling array.

## Key Extract

Cell = state. Transitions = incoming directions. Draw a tiny grid in interviews.
