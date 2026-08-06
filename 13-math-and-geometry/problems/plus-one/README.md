# Plus One

## Problem

You are given a large integer represented as an integer array `digits`, where each `digits[i]` is the ith digit. Increment the large integer by one and return the resulting array of digits.

## Recognition

Digit array + carry → walk from the end; on 9 flip to 0 and continue carry.

## Key Extract

If every digit was 9, prepend a 1 (new length). Otherwise stop at the first non-9.
