# Number of 1 Bits (Hamming Weight)

## Problem

Return number of set bits in a 32-bit integer.

## Code (TypeScript)

```ts
function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n &= n - 1; // clear lowest set bit
    count += 1;
  }
  return count;
}
```

## Key Extract

Brian Kernighan loop — iterations = number of 1-bits, not 32.
