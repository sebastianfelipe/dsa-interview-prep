# Pattern: Permutations

## Recognition

- All orderings of an array
- Next permutation (different pattern — reverse/suffix)
- Anagram generation

## Idea

Used-array or swap-in-place. Build path until length n.

## Key Extract

Permutations care about **order**; combinations do not. Use `used[]` or swaps.
