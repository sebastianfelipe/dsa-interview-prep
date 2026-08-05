# Pattern: Fast & Slow Pointers

## Recognition

- Cycle detection
- Find middle
- nth node from end (two pointers distance n apart)
- Palindrome linked list (find mid → reverse half)

## Idea

`slow` moves 1, `fast` moves 2. If there's a cycle they meet. When `fast` hits null, `slow` is at middle.

```ts
let slow = head;
let fast = head;
while (fast?.next) {
  slow = slow!.next;
  fast = fast.next.next;
}
// slow at middle (for even length, second mid or adjust as needed)
```

## Key Extract

Same-list two speeds replace needing length first. For "nth from end", keep a gap of n between pointers.
