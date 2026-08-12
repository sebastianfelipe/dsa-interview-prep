# Rotate Image

## Problem

Rotate n×n matrix 90° clockwise in place.

## Examples

### Example 1
**Input:** `matrix = [[1,2,3],[4,5,6],[7,8,9]]`
**Output:** `[[7,4,1],[8,5,2],[9,6,3]]`
**Explanation:** 90° clockwise in-place.


## Key Extract

Transpose + reverse rows = 90° clockwise. Counter-clockwise: transpose + reverse columns.
