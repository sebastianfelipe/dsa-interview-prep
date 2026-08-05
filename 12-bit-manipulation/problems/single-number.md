# Single Number

## Problem

Every element appears twice except one; find it. O(1) space.

## Code (TypeScript)

```ts
function singleNumber(nums: number[]): number {
  let x = 0;
  for (const n of nums) x ^= n;
  return x;
}
```

## Key Extract

XOR fold. Variants: triples → bit counting mod 3; two singles → partition by a differing bit.
