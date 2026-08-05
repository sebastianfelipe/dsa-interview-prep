# Product of Array Except Self

## Problem

Return `answer` where `answer[i]` is product of all elements except `nums[i]`. No division. O(n) time.

## Recognition

| Signal | Points to |
|--------|-----------|
| Each index depends on all others | Prefix + suffix products |
| No division | Avoid totalProduct / nums[i] |
| O(n) | Two passes |

## Intuition

`answer[i] = product(left of i) * product(right of i)`.

## Approach

1. First pass: `answer[i] = prefix product of elements before i`.
2. Second pass from right: multiply by running suffix product.

## Walkthrough

`nums = [1,2,3,4]`

After left pass: `answer = [1, 1, 2, 6]`  
Right pass with `suffix`:

| i | suffix before | answer[i] becomes | suffix after |
|---|---------------|-------------------|--------------|
| 3 | 1 | 6 | 4 |
| 2 | 4 | 8 | 12 |
| 1 | 12 | 12 | 24 |
| 0 | 24 | 24 | 24 |

Result: `[24,12,8,6]`.

## Complexity

Time O(n), space O(1) extra if output array does not count.

## Code (TypeScript)

```ts
function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const answer = new Array<number>(n).fill(1);

  let prefix = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = prefix;
    prefix *= nums[i]!;
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i]! *= suffix;
    suffix *= nums[i]!;
  }
  return answer;
}
```

## Pitfalls

- Using division and mishandling zeros
- Off-by-one on prefix/suffix loops
- Claiming O(1) space while allocating two extra arrays (still fine if you clarify)

## Key Extract

**Prefix × suffix** when each index needs "everything else." Same idea as range products / running aggregates from both ends.
