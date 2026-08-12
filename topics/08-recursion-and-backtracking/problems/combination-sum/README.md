# Combination Sum

## Problem

Find all unique combinations in `candidates` that sum to `target`. Unlimited reuse of each number.

## Examples

### Example 1
**Input:** `candidates = [2, 3, 6, 7]`, `target = 7`
**Output:** `[[2, 2, 3], [7]]`
**Explanation:** Combinations that sum to `7` (reuse allowed).


## Recognition

Combinations with reuse → backtracking with same index on recurse.

## Key Extract

Reuse → recurse `i`; no reuse → `i+1`. Prune when candidate > remain. Sort enables early break.
