# Sqrt(x)

## Problem

Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer. The returned integer should be non-negative. Do not use built-in exponent or square-root functions.

## Examples

### Example 1
**Input:** `x = 4`
**Output:** `2`

### Example 2
**Input:** `x = 8`
**Output:** `2`
**Explanation:** `√8 ≈ 2.82`, so the floored integer square root is `2`.


## Recognition

Monotone predicate `mid*mid <= x` → binary search on answer.

## Key Extract

Search `[0, x]` (or `[1, x]`). Be careful with overflow conceptually (`mid > x / mid`). Return the largest `mid` whose square is ≤ `x`.
