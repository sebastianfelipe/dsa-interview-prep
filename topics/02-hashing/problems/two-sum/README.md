# Two Sum

## Problem

Return indices of two numbers in `nums` that add to `target`.

## Examples

### Example 1
**Input:** `nums = [2, 7, 11, 15]`, `target = 9`
**Output:** `[0, 1]`
**Explanation:** `nums[0] + nums[1] = 2 + 7 = 9`, so the indices are `0` and `1`.

### Example 2
**Input:** `nums = [3, 2, 4]`, `target = 6`
**Output:** `[1, 2]`
**Explanation:** `2 + 4 = 6`.


## Recognition

Unsorted + pair sum + indices → **complement hash map** (not two pointers unless sorted).

## Walkthrough

`nums = [2,7,11,15], target = 9`

| i | num | need | seen | result |
|---|-----|------|------|--------|
| 0 | 2 | 7 | {2:0} | — |
| 1 | 7 | 2 | hit 0 | [0,1] |

## Complexity

O(n) time, O(n) space.

## Key Extract

Query then insert. If the array were sorted **and** they wanted values not indices (or allowed sorting), two pointers is the space-O(1) cousin — see Two Sum II.
