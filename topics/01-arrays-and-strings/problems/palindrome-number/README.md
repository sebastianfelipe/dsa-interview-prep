# Palindrome Number

## Problem

Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise. A palindrome reads the same forward and backward. Solve without converting to a string if possible.

## Recognition

Integer palindrome check without string conversion → reverse half the digits mathematically and compare.

## Key Extract

Negatives are never palindromes. Reversing only half avoids overflow and early-exits when the reversed half exceeds the remaining half (trailing-zero case).
