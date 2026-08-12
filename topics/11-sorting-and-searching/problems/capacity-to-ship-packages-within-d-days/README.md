# Capacity To Ship Packages Within D Days

## Problem

Packages in order; ship with capacity. Min capacity to finish in `days` days.

## Examples

### Example 1
**Input:** `weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`, `days = 5`
**Output:** `15`
**Explanation:** Least capacity that ships in 5 days.


## Recognition

Binary search on answer + greedy feasible check.

## Key Extract

`lo = max package`, `hi = sum`. Feasible = simulate days needed. Same pattern as Split Array Largest Sum / Koko.
