# Combination Sum

## Problem

Find all unique combinations in `candidates` that sum to `target`. Unlimited reuse of each number.

## Recognition

Combinations with reuse → backtracking with same index on recurse.

## Key Extract

Reuse → recurse `i`; no reuse → `i+1`. Prune when candidate > remain. Sort enables early break.
