# Two Sum

## Problem

Return indices of two numbers in `nums` that add to `target`.

## Recognition

Unsorted + pair sum + indices → **complement hash map** (not two pointers unless sorted).

## Walkthrough

`nums = [2,7,11,15], target = 9`

| i | num | need | seen | result |
|---|-----|------|------|--------|
| 0 | 2 | 7 | {2:0} | — |
| 1 | 7 | 2 | hit 0 | [0,1] |

## Code (TypeScript)

```ts
function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]!;
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i]!, i);
  }
  return [];
}
```

## Complexity

O(n) time, O(n) space.

## Key Extract

Query then insert. If the array were sorted **and** they wanted values not indices (or allowed sorting), two pointers is the space-O(1) cousin — see Two Sum II.
