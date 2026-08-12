# Palindrome Number

## Problem

Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise. A palindrome reads the same forward and backward. Solve without converting to a string if possible.

## Examples

### Example 1
**Input:** `x = 121`
**Output:** `true`
**Explanation:** Reading left-to-right or right-to-left gives `121`.

### Example 2
**Input:** `x = -121`
**Output:** `false`
**Explanation:** From the left it is `-121`; from the right it would be `121-`.


## Recognition

Integer palindrome check without string conversion → reverse half the digits mathematically and compare.

## Key Extract

Negatives are never palindromes. Reversing only half avoids overflow and early-exits when the reversed half exceeds the remaining half (trailing-zero case).
