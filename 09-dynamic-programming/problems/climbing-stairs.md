# Climbing Stairs

## Problem

n stairs; 1 or 2 steps. How many distinct ways?

## Recognition

Fibonacci 1D DP.

## Code (TypeScript)

```ts
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}
```

## Key Extract

`ways(n) = ways(n-1) + ways(n-2)`. Space O(1). Same recurrence as decode-ways with extra validity checks.
