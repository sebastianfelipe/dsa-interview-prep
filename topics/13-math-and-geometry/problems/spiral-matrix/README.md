# Spiral Matrix

## Problem

Return matrix elements in spiral order.

## Examples

### Example 1
**Input:** `matrix = [[1,2,3],[4,5,6],[7,8,9]]`
**Output:** `[1,2,3,6,9,8,7,4,5]`.


## Key Extract

Shrink four bounds; guard single row/col so you don't double-count.
