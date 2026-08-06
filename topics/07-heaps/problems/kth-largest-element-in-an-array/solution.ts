export function findKthLargest(nums: number[], k: number): number {
  const heap = new MinHeap<number>((a, b) => a - b); // from templates/heap.ts
  for (const num of nums) {
    heap.push(num);
    if (heap.size > k) heap.pop();
  }
  return heap.peek()!;
}
