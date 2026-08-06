# Pattern: Jump / Reach

## Recognition

- Jump Game I/II
- Can you reach the end?

## Idea

Track `farthest` reachable index while scanning. If `i > farthest`, fail. For min jumps, count when you exhaust the current window.

## Key Extract

Maintain reachable frontier. O(n) beats DP O(n²) variants.
