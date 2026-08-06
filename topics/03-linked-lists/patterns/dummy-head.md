# Pattern: Dummy Head

## Recognition

- Head node may be deleted / replaced
- Building a new list from scratch
- Merge / remove / partition near the front

## Idea

```ts
const dummy = new ListNode(0, head);
let tail = dummy;
// ... mutate via tail.next ...
return dummy.next;
```

Uniform code paths — no special-case "if head is null / if deleting head".

## Key Extract

When the real head might change, **dummy head**. Return `dummy.next`.
