# Kth Largest Element in an Array

## Problem

Find the kth largest element in unsorted `nums`.

## Examples

### Example 1
**Input:** `nums = [3, 2, 1, 5, 6, 4]`, `k = 2`
**Output:** `5`
**Explanation:** Sorted descending `[6, 5, …]`; 2nd is `5`.


## Recognition

Top-K → min-heap size k (or Quickselect for average O(n)).

## Key Extract

Min-heap of size k → peek is kth largest. Mention Quickselect if they ask for better average time.
