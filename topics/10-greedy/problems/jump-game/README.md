# Jump Game

## Problem

Each index has jump length `nums[i]`. Can you reach the last index?

## Examples

### Example 1
**Input:** `nums = [2, 3, 1, 1, 4]`
**Output:** `true`
**Explanation:** Jump 1 then 3 steps to the end.

### Example 2
**Input:** `nums = [3, 2, 1, 0, 4]`
**Output:** `false`.


## Key Extract

If you ever stand beyond `farthest`, unreachable. Update farthest as you go.
