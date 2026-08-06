# Find the Index of the First Occurrence in a String

## Problem

Given two strings `haystack` and `needle`, return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.

## Recognition

Substring search → sliding window / two-pointer scan (KMP for optimal worst-case).

## Key Extract

For interview scale, a direct window compare of length `needle` is fine. Empty needle returns 0 by convention.
