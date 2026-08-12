# Add Binary

## Problem

Given two binary strings `a` and `b`, return their sum as a binary string.

## Examples

### Example 1
**Input:** `a = "11"`, `b = "1"`
**Output:** `"100"`
**Explanation:** `3 + 1 = 4` in binary.

### Example 2
**Input:** `a = "1010"`, `b = "1011"`
**Output:** `"10101"`.


## Recognition

Binary string addition → digit-by-digit from the right with a carry bit.

## Key Extract

Same pattern as adding big integers: `sum = bitA + bitB + carry`, append `sum % 2`, set `carry = sum >> 1`.
