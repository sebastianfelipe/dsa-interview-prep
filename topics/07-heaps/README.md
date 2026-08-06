# Heaps (Priority Queues)

Use when you repeatedly need the current min or max.

## Patterns

| Pattern | File |
|---------|------|
| Top-K | [patterns/top-k.md](./patterns/top-k.md) |
| Two heaps | [patterns/two-heaps.md](./patterns/two-heaps.md) |
| Merge K streams | [patterns/merge-k.md](./patterns/merge-k.md) |

## Worked problems

| Problem | File |
|---------|------|
| Kth Largest Element | [problems/kth-largest.md](./problems/kth-largest.md) |
| Merge K Sorted Lists | [problems/merge-k-sorted-lists.md](./problems/merge-k-sorted-lists.md) |

## TypeScript note

JS has no built-in heap. In interviews:

1. Use the `MinHeap` in [`templates/heap.ts`](../../resources/templates/heap.ts), or
2. Say "I'll assume a PriorityQueue" and write `push`/`pop` calls, or
3. Sort when constraints allow O(n log n)

## Key Extract

"Kth", "closest K", "frequent", "merge sorted streams" → heap. Size-k min-heap for kth largest.
