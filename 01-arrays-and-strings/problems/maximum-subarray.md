# Maximum Subarray (Kadane)

## Problem

Find the contiguous subarray with the largest sum; return that sum.

## Recognition

| Signal | Points to |
|--------|-----------|
| Max sum contiguous | Kadane |
| Single pass possible | DP / running best |

## Intuition

At each position: extend previous run or start a new run at current element.

## Walkthrough

`nums = [-2,1,-3,4,-1,2,1,-5,4]`

| num | cur | best |
|-----|-----|------|
| -2 | -2 | -2 |
| 1 | 1 | 1 |
| -3 | -2 | 1 |
| 4 | 4 | 4 |
| -1 | 3 | 4 |
| 2 | 5 | 5 |
| 1 | 6 | 6 |
| -5 | 1 | 6 |
| 4 | 5 | 6 |

Answer: **6** (`[4,-1,2,1]`).

## Complexity

O(n) time, O(1) space.

## Code (TypeScript)

```ts
function maxSubArray(nums: number[]): number {
  let best = nums[0]!;
  let cur = nums[0]!;
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i]!, cur + nums[i]!);
    best = Math.max(best, cur);
  }
  return best;
}
```

## Pitfalls

- Initializing `best` / `cur` to `0` fails when all numbers are negative
- Confusing with maximum **subsequence** (non-contiguous)

## Key Extract

**Extend or restart.** Initialize from `nums[0]`, not `0`. For indices, store `start` when restarting and `bestStart/bestEnd` when updating `best`.
