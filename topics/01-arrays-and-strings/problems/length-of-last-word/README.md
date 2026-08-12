# Length of Last Word

## Problem

Given a string `s` consisting of words and spaces, return the length of the last word in the string. A word is a maximal substring of non-space characters.

## Examples

### Example 1
**Input:** `s = "Hello World"`
**Output:** `5`
**Explanation:** The last word is `"World"` with length `5`.

### Example 2
**Input:** `s = "   fly me   to   the moon  "`
**Output:** `4`
**Explanation:** Ignore trailing spaces; last word is `"moon"`.


## Recognition

Trailing spaces + last token length → scan from the end, skip spaces, then count letters.

## Key Extract

Walk backward past spaces, then count until the next space (or start). Avoids allocating a split array.
