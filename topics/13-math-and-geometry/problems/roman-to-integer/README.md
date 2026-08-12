# Roman to Integer

## Problem

Convert a Roman numeral string to an integer. Roman numerals are usually written largest to smallest left to right, except for subtractive pairs like `IV` = 4 and `IX` = 9.

## Examples

### Example 1
**Input:** `s = "III"`
**Output:** `3`
**Explanation:** `I + I + I = 3`.

### Example 2
**Input:** `s = "MCMXCIV"`
**Output:** `1994`
**Explanation:** `M = 1000`, `CM = 900`, `XC = 90`, `IV = 4`.


## Recognition

Map each symbol to a value; when a smaller value precedes a larger one, subtract instead of add.

## Key Extract

Scan left to right: if `value[s[i]] < value[s[i+1]]`, subtract; otherwise add. Covers all subtractive cases uniformly.
