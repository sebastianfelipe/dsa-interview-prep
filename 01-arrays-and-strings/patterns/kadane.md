# Pattern: Kadane (Maximum Subarray)

## Recognition

- Maximum **sum** of a contiguous subarray
- Variants: max product, circular max subarray

## Intuition

At each index, decide: **extend** the previous best-ending-here, or **start fresh**.

```text
bestEndingHere = max(nums[i], bestEndingHere + nums[i])
bestGlobal = max(bestGlobal, bestEndingHere)
```

## TypeScript

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

## Complexity

O(n) time, O(1) space.

## Key Extract

Local decision "extend or restart" yields global max for this classic problem. If they ask for the **indices**, also track start positions when you restart.
