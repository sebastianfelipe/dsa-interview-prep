# Merge k Sorted Lists

## Problem

Merge k sorted linked lists into one sorted list.

## Recognition

Merge K streams → min-heap of list heads + dummy tail.

## Code (TypeScript)

```ts
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const heap = new MinHeap<ListNode>((a, b) => a.val - b.val);
  for (const node of lists) if (node) heap.push(node);

  const dummy = new ListNode(0);
  let tail = dummy;
  while (heap.size) {
    const node = heap.pop()!;
    tail.next = node;
    tail = node;
    if (node.next) heap.push(node.next);
  }
  return dummy.next;
}
```

## Complexity

O(N log k) where N = total nodes.

## Key Extract

Heap of heads + dummy. Same as merging k sorted arrays.
