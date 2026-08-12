# Merge k Sorted Lists

## Problem

Merge k sorted linked lists into one sorted list.

## Examples

### Example 1
**Input:** `lists = [[1, 4, 5], [1, 3, 4], [2, 6]]`
**Output:** `[1, 1, 2, 3, 4, 4, 5, 6]`.


## Recognition

Merge K streams → min-heap of list heads + dummy tail.

## Complexity

O(N log k) where N = total nodes.

## Key Extract

Heap of heads + dummy. Same as merging k sorted arrays.
