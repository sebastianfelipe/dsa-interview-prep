# Plus One

## Problem

You are given a large integer represented as an integer array `digits`, where each `digits[i]` is the ith digit. Increment the large integer by one and return the resulting array of digits.

## Examples

### Example 1
**Input:** `digits = [1, 2, 3]`
**Output:** `[1, 2, 4]`
**Explanation:** The number `123` plus one is `124`.

### Example 2
**Input:** `digits = [9, 9]`
**Output:** `[1, 0, 0]`
**Explanation:** `99 + 1 = 100`.


## Recognition

Digit array + carry → walk from the end; on 9 flip to 0 and continue carry.

## Key Extract

If every digit was 9, prepend a 1 (new length). Otherwise stop at the first non-9.
