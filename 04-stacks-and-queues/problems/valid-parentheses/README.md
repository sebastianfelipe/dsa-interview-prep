# Valid Parentheses

## Problem

Given a string of `()[]{}`, determine if it is valid.

## Recognition

Nested matching → **stack**.

## Key Extract

Push openers; on closer, top must match. Empty stack at end. Same skeleton for path simplify and decode-string.
