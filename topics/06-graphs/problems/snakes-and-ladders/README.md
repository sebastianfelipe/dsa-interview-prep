# Snakes and Ladders

## Problem

You are given an `n x n` board representing a snakes-and-ladders game. Squares are labeled `1` to `n²` in a Boustrophedon style. Return the least number of dice moves to reach square `n²`. If impossible, return `-1`. A snake or ladder at a destination must be taken (teleport to its destination).

## Examples

### Example 1
**Input:**
```
board = [
  [-1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1],
  [-1, 35, -1, -1, 13, -1],
  [-1, -1, -1, -1, -1, -1],
  [-1, 15, -1, -1, -1, -1]
]
```
**Output:** `4`
**Explanation:** Start at `1`. One optimal path uses ladders/snakes and reaches `36` in 4 dice rolls (classic LeetCode sample).


## Recognition

Unweighted shortest path on board positions → BFS over squares with dice rolls 1–6.

## Key Extract

Map label → (row, col) carefully (zigzag rows). From each square, try rolls 1–6; if destination has a snake/ladder, use that cell value. Visit each label once.
