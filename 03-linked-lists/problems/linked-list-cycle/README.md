# Linked List Cycle

## Problem

Return whether a linked list has a cycle.

## Recognition

**Floyd cycle detection** — fast & slow.

## Follow-up: find cycle start

After meeting, reset one pointer to head; advance both 1 step — they meet at cycle entrance.

## Key Extract

Meeting ⇒ cycle. Optional second phase finds entrance. O(1) space beats hash-set of nodes.
