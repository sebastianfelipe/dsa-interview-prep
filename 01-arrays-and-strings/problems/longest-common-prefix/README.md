# Longest Common Prefix

## Problem

Write a function to find the longest common prefix string amongst an array of strings. Return `""` if there is no common prefix.

## Recognition

Multiple strings → walk character-by-character of the shortest (or first) string until a mismatch.

## Key Extract

Use the first string as a candidate and shrink it whenever another string diverges. Vertical scan is O(S) over all characters.
