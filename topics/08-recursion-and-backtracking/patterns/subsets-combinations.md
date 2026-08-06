# Pattern: Subsets & Combinations

## Recognition

- All subsets
- Combinations of size k
- Combination sum (with/without reuse)

## Idea

At each index: skip or take (and advance). For combinations, pass `start` to avoid duplicates/order variants.

Reuse allowed → recurse with same `i`.  
No reuse → recurse with `i + 1`.

## Key Extract

`start` index enforces non-decreasing picks (combinations not permutations). Sort first when skipping duplicate values.
