# Daily Temperatures

## Problem

`temperatures[i]` is degrees on day i. Return array `answer` where `answer[i]` is days until a warmer temperature, or 0.

## Examples

### Example 1
**Input:** `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`
**Output:** `[1, 1, 4, 2, 1, 1, 0, 0]`
**Explanation:** Days until a warmer temperature for each index.


## Recognition

**Next greater element** → monotonic decreasing stack of indices.

## Walkthrough

`[73,74,75,71,69,72,76,73]`

When 74 arrives, 73 pops → answer[0]=1. When 76 arrives, 72,69,71,... resolve, etc.

## Complexity

O(n) time — each index push/pop once. O(n) space.

## Key Extract

Unresolved colder days sit on stack; first warmer day resolves them. Template for all next-greater problems.
