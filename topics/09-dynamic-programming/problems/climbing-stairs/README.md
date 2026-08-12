# Climbing Stairs

## Problem

n stairs; 1 or 2 steps. How many distinct ways?

## Examples

### Example 1
**Input:** `n = 2`
**Output:** `2`
**Explanation:** `1+1` or `2`.

### Example 2
**Input:** `n = 3`
**Output:** `3`
**Explanation:** `1+1+1`, `1+2`, `2+1`.


## Recognition

Fibonacci 1D DP.

## Key Extract

`ways(n) = ways(n-1) + ways(n-2)`. Space O(1). Same recurrence as decode-ways with extra validity checks.
