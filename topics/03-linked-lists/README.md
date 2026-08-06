# Linked Lists

Pointer surgery under constraints: no random access, O(1) insert/delete at a known node.

## Patterns

| Pattern | File |
|---------|------|
| Fast & slow | [patterns/fast-slow.md](./patterns/fast-slow.md) |
| Reverse | [patterns/reverse.md](./patterns/reverse.md) |
| Dummy head | [patterns/dummy-head.md](./patterns/dummy-head.md) |

## Worked problems

| Problem | File |
|---------|------|
| Reverse Linked List | [problems/reverse-list.md](./problems/reverse-list.md) |
| Linked List Cycle | [problems/linked-list-cycle.md](./problems/linked-list-cycle.md) |
| Merge Two Sorted Lists | [problems/merge-two-sorted-lists.md](./problems/merge-two-sorted-lists.md) |

## TypeScript node

```ts
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}
```

## Key Extract

Draw pointers before coding. Name `prev`, `curr`, `next` and update in a safe order.
