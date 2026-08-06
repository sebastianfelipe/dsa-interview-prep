# Longest Substring Without Repeating Characters

## Problem

Given string `s`, return length of the longest substring with all unique characters.

## Recognition

| Signal | Points to |
|--------|-----------|
| Substring (contiguous) | Sliding window |
| Constraint: no repeats | Window validity = all unique |
| Longest | Track max length while valid |

## Intuition

Grow a window with `right`. When a duplicate appears inside the window, advance `left` past the previous occurrence.

## Approach

Keep `Map<char, lastIndex>`. On each `right`, if char was seen at index ≥ `left`, set `left = lastIndex + 1`. Update best length.

## Walkthrough

`s = "abcabcbb"`

| right | char | left | window | best |
|-------|------|------|--------|------|
| 0 | a | 0 | a | 1 |
| 1 | b | 0 | ab | 2 |
| 2 | c | 0 | abc | 3 |
| 3 | a | 1 | bca | 3 |
| 4 | b | 2 | cab | 3 |
| 5 | c | 3 | abc | 3 |
| 6 | b | 5 | cb | 3 |
| 7 | b | 7 | b | 3 |

Answer: **3** (`"abc"`).

## Complexity

Time O(n), space O(min(n, alphabet)).

## Pitfalls

- Shrinking one-by-one when jump-to-`prev+1` is enough
- Updating `last` before checking (order matters depending on style)
- Empty string → 0

## Key Extract

**Variable window + last-seen index.** Invalid when duplicate's last index is still inside `[left, right]`. Reuse for "at most k distinct" by swapping the validity condition.
