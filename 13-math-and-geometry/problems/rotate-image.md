# Rotate Image

## Problem

Rotate n×n matrix 90° clockwise in place.

## Code (TypeScript)

```ts
function rotate(matrix: number[][]): void {
  const n = matrix.length;
  // transpose
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i]![j], matrix[j]![i]] = [matrix[j]![i]!, matrix[i]![j]!];
    }
  }
  // reverse each row
  for (const row of matrix) row.reverse();
}
```

## Key Extract

Transpose + reverse rows = 90° clockwise. Counter-clockwise: transpose + reverse columns.
