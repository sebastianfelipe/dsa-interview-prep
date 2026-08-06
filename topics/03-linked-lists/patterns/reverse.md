# Pattern: Reverse Linked List

## Recognition

- Reverse whole or sublist
- Reorder list / palindrome checks

## Iterative template

```ts
let prev: ListNode | null = null;
let curr = head;
while (curr) {
  const next = curr.next;
  curr.next = prev;
  prev = curr;
  curr = next;
}
return prev;
```

**Order matters:** save `next` before overwriting `curr.next`.

## Key Extract

Three pointers: `prev`, `curr`, `next`. Memorize the four-line body. For reverse-between-m-and-n, walk to m, then apply the same loop for a fixed count.
