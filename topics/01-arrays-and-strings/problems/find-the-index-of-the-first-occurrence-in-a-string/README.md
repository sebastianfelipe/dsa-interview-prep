# Find the Index of the First Occurrence in a String

## Problem

Given two strings `haystack` and `needle`, return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.

## Examples

### Example 1
**Input:** `haystack = "sadbutsad"`, `needle = "sad"`
**Output:** `0`
**Explanation:** `"sad"` appears first at index `0`.

### Example 2
**Input:** `haystack = "leetcode"`, `needle = "leeto"`
**Output:** `-1`
**Explanation:** `"leeto"` is not a substring.


## Recognition

Substring search → sliding window / two-pointer scan (KMP for optimal worst-case).

## Key Extract

For interview scale, a direct window compare of length `needle` is fine. Empty needle returns 0 by convention.
