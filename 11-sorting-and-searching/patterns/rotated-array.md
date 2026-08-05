# Pattern: Rotated Sorted Array

## Recognition

- Sorted then rotated
- Search target / find minimum

## Idea

One half of `[lo, mid]` / `[mid, hi]` is always sorted. Check which half is sorted and whether target lies in it.

## Key Extract

Identify the sorted half each step; discard the impossible half.
