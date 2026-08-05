# Reverse Linked List

## Problem

Reverse a singly linked list; return new head.

## Recognition

Classic **iterative reverse** (or recursive).

## Walkthrough

`1 → 2 → 3 → null`

| curr | next | after flip | prev |
|------|------|------------|------|
| 1 | 2 | 1→null | 1 |
| 2 | 3 | 2→1→null | 2 |
| 3 | null | 3→2→1→null | 3 |

## Code (TypeScript)

```ts
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```

## Key Extract

Save `next` → flip link → advance `prev` and `curr`. Recursion: reverse rest, then `head.next.next = head; head.next = null`.
