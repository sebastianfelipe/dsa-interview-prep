# Unique Paths

## Problem

Robot from top-left to bottom-right on m×n grid; only right/down. Count paths.

## Recognition

Grid DP: `dp[r][c] = dp[r-1][c] + dp[r][c-1]`.

## Key Extract

First row/col = 1. Compress to 1D. Obstacles variant: blocked cell → 0.
