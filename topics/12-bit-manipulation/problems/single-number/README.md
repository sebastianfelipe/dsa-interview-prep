# Single Number

## Problem

Every element appears twice except one; find it. O(1) space.

## Examples

### Example 1
**Input:** `nums = [2, 2, 1]`
**Output:** `1`
**Explanation:** Every value appears twice except `1`.


## Key Extract

XOR fold. Variants: triples → bit counting mod 3; two singles → partition by a differing bit.
