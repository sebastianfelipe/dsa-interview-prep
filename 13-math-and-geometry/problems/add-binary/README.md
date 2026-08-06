# Add Binary

## Problem

Given two binary strings `a` and `b`, return their sum as a binary string.

## Recognition

Binary string addition → digit-by-digit from the right with a carry bit.

## Key Extract

Same pattern as adding big integers: `sum = bitA + bitB + carry`, append `sum % 2`, set `carry = sum >> 1`.
