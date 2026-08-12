# Remove Duplicates from Sorted List

## Problem

Given the `head` of a sorted linked list, delete all duplicates so each element appears only once. Return the linked list sorted as well.

## Examples

### Example 1
**Input:** `head = [1, 1, 2]`
**Output:** `[1, 2]`

### Example 2
**Input:** `head = [1, 1, 2, 3, 3]`
**Output:** `[1, 2, 3]`.


## Recognition

Sorted linked list + unique → walk and skip next when values match.

## Key Extract

When `curr.val === curr.next.val`, set `curr.next = curr.next.next`; otherwise advance. Sorting guarantees duplicates are adjacent.
