# Merge Intervals

## Problem

Merge all overlapping intervals.

## Code (TypeScript)

```ts
function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0]! - b[0]!);
  const result: number[][] = [];

  for (const interval of intervals) {
    const last = result[result.length - 1];
    if (!last || interval[0]! > last[1]!) {
      result.push([...interval]);
    } else {
      last[1] = Math.max(last[1]!, interval[1]!);
    }
  }
  return result;
}
```

## Key Extract

Sort by start; extend or append. Insert Interval = merge after inserting into sorted place.
