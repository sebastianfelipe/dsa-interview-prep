# Valid Parentheses

## Problem

Given a string of `()[]{}`, determine if it is valid.

## Examples

### Example 1
**Input:** `s = "()"`
**Output:** `true`

### Example 2
**Input:** `s = "(]"`
**Output:** `false`
**Explanation:** The closer `] ` does not match the opener `(`.


## Recognition

Nested matching → **stack**.

## Key Extract

Push openers; on closer, top must match. Empty stack at end. Same skeleton for path simplify and decode-string.
