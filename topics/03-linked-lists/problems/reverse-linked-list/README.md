# Reverse Linked List

## Problem

Reverse a singly linked list; return new head.

## Examples

### Example 1
**Input:** `head = [1, 2, 3, 4, 5]`
**Output:** `[5, 4, 3, 2, 1]`.


## Recognition

Classic **iterative reverse** (or recursive).

## Walkthrough

`1 → 2 → 3 → null`

| curr | next | after flip | prev |
|------|------|------------|------|
| 1 | 2 | 1→null | 1 |
| 2 | 3 | 2→1→null | 2 |
| 3 | null | 3→2→1→null | 3 |

## Key Extract

Save `next` → flip link → advance `prev` and `curr`. Recursion: reverse rest, then `head.next.next = head; head.next = null`.
