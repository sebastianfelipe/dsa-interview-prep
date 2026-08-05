# Kth Largest Element in an Array

## Problem

Find the kth largest element in unsorted `nums`.

## Recognition

Top-K → min-heap size k (or Quickselect for average O(n)).

## Code (TypeScript)

```ts
function findKthLargest(nums: number[], k: number): number {
  const heap = new MinHeap<number>((a, b) => a - b); // from templates/heap.ts
  for (const num of nums) {
    heap.push(num);
    if (heap.size > k) heap.pop();
  }
  return heap.peek()!;
}
```

Interview alternative without heap class: `nums.sort((a,b)=>b-a)[k-1]` and note complexity.

## Key Extract

Min-heap of size k → peek is kth largest. Mention Quickselect if they ask for better average time.
