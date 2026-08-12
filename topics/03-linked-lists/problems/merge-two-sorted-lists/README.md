# Merge Two Sorted Lists

## Problem

Merge two sorted lists into one sorted list.

## Examples

### Example 1
**Input:** `list1 = [1, 2, 4]`, `list2 = [1, 3, 4]`
**Output:** `[1, 1, 2, 3, 4, 4]`
**Explanation:** Merge while keeping non-decreasing order.


## Recognition

Dummy head + two-pointer merge (like merge step of merge sort).

## Key Extract

**Dummy + tail.** Always attach the smaller head; splice remainder when one list ends. Same idea as merge k lists (with a heap of heads).
