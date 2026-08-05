# Pattern: Top-K with Heap

## Recognition

- Kth largest / smallest
- Top K frequent
- K closest points

## Idea

Keep a heap of size k:

- **Kth largest** → min-heap of size k (root is kth)
- **Kth smallest** → max-heap of size k

```ts
// see templates/heap.ts — findKthLargest
```

## Complexity

O(n log k) time, O(k) space — better than full sort when k ≪ n.

## Key Extract

Heap size bound is the trick. For exact top-k frequent, frequency map first then heap/buckets.
