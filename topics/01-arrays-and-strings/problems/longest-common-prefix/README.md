# Longest Common Prefix

## Problem

Write a function to find the longest common prefix string amongst an array of strings. Return `""` if there is no common prefix.

## Examples

### Example 1
**Input:** `strs = ["flower", "flow", "flight"]`
**Output:** `"fl"`
**Explanation:** The shared start of every word is `"fl"`.

### Example 2
**Input:** `strs = ["dog", "racecar", "car"]`
**Output:** `""`
**Explanation:** There is no character shared at the start of all three.


## Recognition

Multiple strings → walk character-by-character of the shortest (or first) string until a mismatch.

## Key Extract

Use the first string as a candidate and shrink it whenever another string diverges. Vertical scan is O(S) over all characters.
