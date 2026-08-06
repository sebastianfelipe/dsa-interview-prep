# Two Sum II — Input Array Is Sorted

## Problem

Given a **1-indexed** sorted array `numbers` and `target`, return indices of two numbers that add to `target`. Exactly one solution. Use O(1) extra space.

## Recognition

| Signal | Points to |
|--------|-----------|
| Sorted | Two pointers or binary search |
| Pair sum | Opposite-ends two pointers |
| O(1) space required | Avoid hash map |

## Intuition

If `numbers[left] + numbers[right]` is too small, increase left (need larger). If too big, decrease right.

## Approach

1. `left = 0`, `right = n - 1` (convert to 0-index; return +1 if 1-indexed).
2. Move pointers until sum matches.

## Walkthrough

`numbers = [2,7,11,15], target = 9`

| left | right | sum | action |
|------|-------|-----|--------|
| 0 (2) | 3 (15) | 17 | too big → right-- |
| 0 (2) | 2 (11) | 13 | too big → right-- |
| 0 (2) | 1 (7) | 9 | done → [1,2] |

## Complexity

Time O(n), space O(1).

## Pitfalls

- Returning 0-based indices when problem asks 1-based
- Using hash map when interviewer constrained space
- Infinite loop if you forget to move a pointer

## Key Extract

**Sorted pair sum → opposite two pointers.** Compare sum to target; move the side that reduces the error. Same skeleton as Container With Most Water (move the shorter line).
