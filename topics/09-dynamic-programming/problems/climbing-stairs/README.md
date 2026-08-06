# Climbing Stairs

## Problem

n stairs; 1 or 2 steps. How many distinct ways?

## Recognition

Fibonacci 1D DP.

## Key Extract

`ways(n) = ways(n-1) + ways(n-2)`. Space O(1). Same recurrence as decode-ways with extra validity checks.
