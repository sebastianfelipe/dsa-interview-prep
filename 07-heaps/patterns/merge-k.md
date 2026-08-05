# Pattern: Merge K Sorted Streams

## Recognition

- Merge k sorted lists/arrays
- Smallest range covering elements from k lists

## Idea

Min-heap of current heads `(value, listIndex, elementIndex)`. Pop min, push next from that list.

## Key Extract

Heap replaces k-way linear scan. Always O(log k) to find next global min among heads.
