# Sqrt(x)

## Problem

Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer. The returned integer should be non-negative. Do not use built-in exponent or square-root functions.

## Recognition

Monotone predicate `mid*mid <= x` → binary search on answer.

## Key Extract

Search `[0, x]` (or `[1, x]`). Be careful with overflow conceptually (`mid > x / mid`). Return the largest `mid` whose square is ≤ `x`.
