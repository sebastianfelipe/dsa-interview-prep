# Pattern: Merge Intervals

## Recognition

- Merge overlapping
- Insert interval
- Non-overlapping removal count

## Idea

Sort by start. If current starts ≤ last merged end → extend end; else push new.

## Key Extract

Sorted starts make overlaps contiguous in the scan.
